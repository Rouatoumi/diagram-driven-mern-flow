import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Fixed import
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Search, Loader2, Calendar as CalendarIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import axios from 'axios';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Define interfaces
interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  startingPrice: number;
  currentPrice: number;
  bidStartDate: string;
  bidEndDate: string;
  subCategoryId: string;
  ownerId: string;
  ownerEmail: string;
  buyerId?: string;
}

interface Category {
  _id: string;
  name: string;
  subCategories: {
    id: string;
    name: string;
  }[];
}

// Define validation schema for new post form
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  images: z.array(z.string()).max(5, 'Maximum 5 images').optional(),
  startingPrice: z.number().min(0, 'Price must be positive'),
  currentPrice: z.number().min(0, 'Price must be positive').optional(),
  bidStartDate: z.date(),
  bidEndDate: z.date(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  
});

type FormValues = z.infer<typeof formSchema>;

const AuctionApp = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'browse' | 'create'>('browse');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFormCategory, setSelectedFormCategory] = useState<Category | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startingPrice: 0,
      currentPrice: 0,
      bidStartDate: new Date(),
      bidEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      
    },
  });

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(selectedCategory === "all" 
            ? 'http://localhost:3000/api/products' 
            : `http://localhost:3000/api/categories/${selectedCategory}`),
          axios.get('http://localhost:3000/api/categories')
        ]);

        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, toast]);

  // Handle search and sorting
  useEffect(() => {
    if (loading) return;
    
    let result = [...products];
    
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-high": return b.currentPrice - a.currentPrice;
        case "price-low": return a.currentPrice - b.currentPrice;
        case "ending-soon": 
          return new Date(a.bidEndDate).getTime() - new Date(b.bidEndDate).getTime();
        default: // newest
          return new Date(b.bidStartDate).getTime() - new Date(a.bidStartDate).getTime();
      }
    });
    
    setFilteredProducts(result);
  }, [searchQuery, sortBy, products, loading]);

  // Handle category change in form
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    setSelectedFormCategory(category || null);
    setValue('categoryId', categoryId);
    setValue('subCategoryId', '');
  };


  // Handle new product submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!user?._id || !user?.email) {
        toast({
          title: 'Error',
          description: 'User not authenticated',
          variant: 'destructive',
        });
        return;
      }

      // Handle image uploads
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach((file) => {
          formData.append('images', file);
        });

        const uploadRes = await axios.post(
          'http://localhost:3000/api/upload', 
          formData,
          {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        imageUrls = uploadRes.data.imagePaths;
      }

      // Prepare the product data
      const postData = {
        name: data.name,
        description: data.description || '',
        images: imageUrls,
        startingPrice: Number(data.startingPrice),
        currentPrice: Number(data.startingPrice),
        bidStartDate: data.bidStartDate.toISOString(),
        bidEndDate: data.bidEndDate.toISOString(),
        subCategoryId: data.subCategoryId || null,
        ownerId: user._id,
        ownerEmail: user.email,
        
      };

      // Submit to backend
      await axios.post('http://localhost:3000/api/products', postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast({
        title: 'Success!',
        description: 'Product created successfully',
      });

      // Reset form and switch to browse view
      reset();
      setSelectedImages([]);
      setView('browse');
      
      // Refresh products list
      const productsRes = await axios.get('http://localhost:3000/api/products');
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions
  const getTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Auction ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  if (loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin" />
          <p className="mt-4">Loading auctions...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster />
      
      <div className="container mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <Button
              variant={view === 'browse' ? 'default' : 'outline'}
              onClick={() => setView('browse')}
              className="rounded-r-none"
            >
              Browse Auctions
            </Button>
            <Button
              variant={view === 'create' ? 'default' : 'outline'}
              onClick={() => setView('create')}
              className="rounded-l-none"
              disabled={!user}
            >
              Create Auction
            </Button>
          </div>
        </div>

        {view === 'browse' ? (
          <>
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">Discover Auctions</h1>
              <p className="text-gray-600">
                Browse through our wide selection of auctions and find the perfect item.
              </p>
            </div>
            
            {/* Search and Filter Section */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search auctions..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(value) => {
                      setSelectedCategory(value);
                      setLoading(true);
                    }}
                  >
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort" className="mt-1">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="ending-soon">Ending Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Auction Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card key={product._id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Link to={`/auctions/${product._id}`} className="block">
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        {product.images?.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="object-cover w-full h-full transition-transform hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-600">
                        <Clock size={14} />
                        <span>{getTimeLeft(product.bidEndDate)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-500">Current Price</div>
                          <div className="font-bold">${product.currentPrice.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">
                            Starting at ${product.startingPrice.toFixed(2)}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Heart size={16} />
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        onClick={() => navigate(`/auction_details/${product._id}`)}
                        disabled={!user}
                      >
                        Bid Now
                      </Button>
                    </CardFooter>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No auctions found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                  <Button onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSortBy("newest");
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Auction Post</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your product in detail"
                  rows={5}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images">Upload Images (Max 5)</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 5) {
                      toast({
                        title: 'Error',
                        description: 'You can upload a maximum of 5 images.',
                        variant: 'destructive',
                      });
                      return;
                    }
                    setSelectedImages(files);
                  }}
                />
                {selectedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedImages.map((file, idx) => (
                      <div key={`image-${idx}`} className="text-xs text-gray-500">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Starting Price */}
              <div className="space-y-2">
                <Label htmlFor="startingPrice">Starting Price *</Label>
                <Input
                  id="startingPrice"
                  type="number"
                  {...register('startingPrice', { valueAsNumber: true })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.startingPrice && <p className="text-sm text-red-500">{errors.startingPrice.message}</p>}
              </div>

           


              {/* Bid Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bid Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watch('bidStartDate') && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch('bidStartDate') ? (
                          format(watch('bidStartDate'), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={watch('bidStartDate')}
                        onSelect={(date) => date && setValue('bidStartDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.bidStartDate && <p className="text-sm text-red-500">{errors.bidStartDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Bid End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watch('bidEndDate') && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch('bidEndDate') ? (
                          format(watch('bidEndDate'), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={watch('bidEndDate')}
                        onSelect={(date) => date && setValue('bidEndDate', date)}
                        initialFocus
                        fromDate={watch('bidStartDate')}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.bidEndDate && <p className="text-sm text-red-500">{errors.bidEndDate.message}</p>}
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <select
                  {...register('categoryId')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={`cat-${category._id}`} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
              </div>

              {/* Subcategory Selection */}
              <div className="space-y-2">
                <Label>Subcategory *</Label>
                <select
                  {...register('subCategoryId')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedFormCategory}
                >
                  <option value="">Select a subcategory</option>
                  {selectedFormCategory?.subCategories.map((subCategory) => (
                    <option key={`subcat-${subCategory.id}`} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
                {errors.subCategoryId && <p className="text-sm text-red-500">{errors.subCategoryId.message}</p>}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Auction'
                )}
              </Button>
            </form>
          </div>
        )}
      </div>

      

      <Footer />
    </>
  );
};

export default AuctionApp;