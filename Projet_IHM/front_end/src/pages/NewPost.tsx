import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from "@/components/ui/toaster";

// Define validation schema - removed biddingType
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

interface Category {
  _id: string;
  name: string;
  subCategories: {
    id: string;
    name: string;
  }[];
}

export default function NewPost() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Update subcategories when category changes
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c._id === categoryId);
    setSelectedCategory(category || null);
    setValue('categoryId', categoryId);
    setValue('subCategoryId', '');
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // 1. Verify authentication
      if (!user?._id || !user?.email) {
        toast({
          title: 'Error',
          description: 'User not authenticated',
          variant: 'destructive',
        });
        return;
      }

      // 2. Handle image uploads
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

      // 3. Prepare the product data - removed biddingType
      const postData = {
        name: data.name,
        description: data.description || '',
        images: imageUrls,
        startingPrice: Number(data.startingPrice),
        currentPrice: Number(data.startingPrice),
        bidStartDate: new Date(data.bidStartDate).toISOString(),
        bidEndDate: new Date(data.bidEndDate).toISOString(),
        subCategoryId: data.subCategoryId || null,
        ownerId: user._id,
        ownerEmail: user.email,
      };

      console.log('Submitting product:', postData);
      const response = await axios.post(
        'http://localhost:3000/api/products', 
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast({
        title: 'Success!',
        description: 'Product created successfully',
      });

    } catch (error: any) {
      console.error('Submission error:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });

      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
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
            disabled={loadingCategories}
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
            disabled={!selectedCategory}
          >
            <option value="">Select a subcategory</option>
            {selectedCategory?.subCategories.map((subCategory) => (
              <option key={`subcat-${subCategory.id}`} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
          {errors.subCategoryId && <p className="text-sm text-red-500">{errors.subCategoryId.message}</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Auction'}
        </Button>
        <Toaster/>
      </form>
    </div>
  );
}