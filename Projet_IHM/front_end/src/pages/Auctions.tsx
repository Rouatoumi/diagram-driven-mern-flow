import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Search, Loader2 } from "lucide-react";
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

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  startingPrice: number;
  currentPrice: number;
  bidStartDate: Date;
  bidEndDate: Date;
  subCategoryId: string;
  ownerId: string;
  ownerEmail: string;
  buyerId?: string;
}

const Auctions = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch products data with optional category filter
  const fetchProducts = async (category: string = "all") => {
    try {
      let url = 'http://localhost:3000/api/products';
      if (category !== "all") {
        url = `http://localhost:3000/api/categories/${category}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and fetch when category changes
  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory, toast]);

  // Handle search and sorting (frontend only as these might be quick operations)
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

  const getTimeLeft = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Auction ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  const handleBidSubmit = async () => {
    if (!selectedProduct || !bidAmount) return;

    const now = new Date();
    const bidEndDate = new Date(selectedProduct.bidEndDate);
    if (now > bidEndDate) {
      toast({
        title: "Auction Ended",
        description: "This auction has ended, and no more bids can be placed.",
        variant: "destructive",
      });
      setIsBidDialogOpen(false);
      return;
    }

    const numericBid = parseFloat(bidAmount);
    if (isNaN(numericBid) || numericBid <= (selectedProduct?.currentPrice || 0)) {
      toast({ 
        title: "Invalid amount", 
        description: `Bid must be higher than $${selectedProduct?.currentPrice.toFixed(2)}`,
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Please login to place a bid");
      }

      const response = await fetch('http://localhost:3000/api/bids', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}` 
        },
        body: JSON.stringify({
          productId: selectedProduct._id,
          bidAmount: numericBid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message.includes("Authentication") || errorData.message.includes("Unauthorized")) {
          localStorage.removeItem('token');
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again to place a bid.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        } else if (errorData.message.includes("Product not found")) {
          throw new Error("This product is no longer available");
        } else if (errorData.message.includes("Bid must be higher")) {
          throw new Error(errorData.message);
        }
        throw new Error(errorData.message || "Bid failed");
      }

      const responseData = await response.json();

      toast({
        title: "Bid Placed!",
        description: `Your $${numericBid.toFixed(2)} bid has been placed, and a notification has been sent to the owner.`,
      });

      // Refresh product data
      fetchProducts(selectedCategory);

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsBidDialogOpen(false);
      setBidAmount("");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading auctions...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster />
      
      <div className="container mx-auto px-4 py-8">
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
              <label htmlFor="search" className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
              <div className="relative">
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
              <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <Select 
                value={selectedCategory} 
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setLoading(true); // Show loading when changing category
                }}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="collectibles">Collectibles</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="home & garden">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 mb-1 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort">
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
                    <Badge className="absolute top-2 left-2 bg-pink-500">
                      {product.subCategoryId || 'Uncategorized'}
                    </Badge>
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
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsBidDialogOpen(true);
                    }}
                    disabled={!localStorage.getItem('token')}
                  >
                    Bid Now
                  </Button>
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
      </div>

      {/* Bid Dialog */}
      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place a Bid</DialogTitle>
            <DialogDescription>
              You're bidding on: {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Price</label>
              <p className="font-bold">${selectedProduct?.currentPrice.toFixed(2)}</p>
            </div>
            <div>
              <label htmlFor="bidAmount" className="block text-sm font-medium mb-1">
                Your Bid Amount
              </label>
              <Input
                id="bidAmount"
                type="number"
                min={selectedProduct ? selectedProduct.currentPrice + 0.01 : undefined}
                step="0.01"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={selectedProduct ? 
                  `Min $${(selectedProduct.currentPrice + 1).toFixed(2)}` : 
                  "Enter amount"}
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleBidSubmit}
              disabled={isSubmitting || !bidAmount}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Bid"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Auctions;