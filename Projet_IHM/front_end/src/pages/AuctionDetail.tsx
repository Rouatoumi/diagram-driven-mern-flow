import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, ArrowLeft, Clock, Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  isActive: boolean;
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  ownerEmail: string;
  buyerId?: string;
  biddingType: 'open' | 'blind';
}

interface Bid {
  _id: string;
  bidAmount: number;
  bidTime: string;
  bidderId: {
    _id: string;
    name: string;
    email: string;
  };
  isWinningBid: boolean;
  productId: string;
}


const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, bidsRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/products/${id}`),
          axios.get(`http://localhost:3000/api/bids/products/${id}`)
        ]);
        setProduct(productRes.data);
        console.log("Product data:", product);
        console.log("Bids data:", bidsRes.data.bids);
        setBids(bidsRes.data.bids);
        console.log("Bids :", bids);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch data",
          variant: "destructive"
        });
        navigate("/auctions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  const handleStopAuction = async () => {
    console.log("Stopping auction for product:", product?.ownerId._id);
    console.log("User ID:", user?._id);
    try {
      if (bids.length === 0) {
        alert('No bids placed yet, cannot stop auction.');
        return;
      }
  
      // ✅ Find the highest bid
      const highestBid = bids.reduce((prev, current) => {
        return (current.bidAmount > prev.bidAmount) ? current : prev;
      });
  
      console.log("Highest bid:", highestBid);
  
      // ✅ Prepare update data
      const updateData = {
        status: 'sold',
        isActive: false,
        winner: highestBid.bidderId._id  // ✅ correct field path
      };
  
      // ✅ Send PUT request
      await axios.put(`http://localhost:3000/api/products/${product._id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,  // Should be JWT token not user._id
        }
      });
  
      alert('Auction stopped and winner updated successfully!');
      window.location.reload();
      // Optionally refresh product state here
    } catch (error) {
      console.error(error);
      alert('Failed to stop auction');
    }
  };
  
  

  const handleBidSubmit = async () => {
    if (!product || !bidAmount) return;

    const now = new Date();
    const bidEndDate = new Date(product.bidEndDate);
    if (now > bidEndDate) {
      toast({
        title: "Auction Ended",
        description: "This auction has ended, and no more bids can be placed.",
        variant: "destructive",
      });
      return;
    }

    const numericBid = parseFloat(bidAmount);
    if (isNaN(numericBid)) {
      toast({ 
        title: "Invalid amount", 
        description: "Please enter a valid number",
        variant: "destructive" 
      });
      return;
    }

    if (numericBid <= product.currentPrice) {
      toast({ 
        title: "Invalid amount", 
        description: `Bid must be higher than $${product.currentPrice.toFixed(2)}`,
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      console.log("Token:", token);
      if (!token) {
        throw new Error("Please login to place a bid");
      }

      const response = await axios.post(`http://localhost:3000/api/bids/${product._id}`, {
        productId: product._id,
        bidAmount: numericBid,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      toast({
        title: "Bid Placed!",
        description: `Your $${numericBid.toFixed(2)} bid has been placed.`,
      });

      // Refresh product data
      const productRes = await axios.get(`http://localhost:3000/api/products/${id}`);
      console.log("Product data after bid:", productRes.data);
      setProduct(productRes.data);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Auction ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h left`;
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const goToPrevious = () => {
    setSelectedImageIndex(prevIndex => 
      prevIndex === 0 ? product!.images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex(prevIndex => 
      prevIndex === product!.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin" />
          <p className="mt-4">Loading auction details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Auction not found</h3>
          <Button onClick={() => navigate("/auctions")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Auctions
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate("/auctions")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Auctions
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-1 space-y-4">
            {/* Main Image (smaller dimensions) */}
            <div 
              className="rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
              style={{ width: '100%', height: '300px' }}
              onClick={() => openImageViewer(0)}
            >
              {product.images?.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery (smaller thumbnails) */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className="rounded-md overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ width: '100%', height: '80px' }}
                    onClick={() => openImageViewer(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Middle Column - Product Details */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <Clock size={16} />
                      <span>{getTimeLeft(product.bidEndDate)}</span>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Heart size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Current Price</Label>
                    <p className="text-3xl font-bold">${product.currentPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Starting price: ${product.startingPrice.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <p className="text-gray-700">{product.description || "No description provided"}</p>
                  </div>

                  <div>
                    <Label>Bidding Type</Label>
                    <p className="text-gray-700 capitalize">{product.biddingType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bids Table and Bid Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
              </CardHeader>
              <CardContent>
              {bids.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bidder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bids.map((bid) => (
                      <TableRow key={bid._id}>
                        <TableCell className="font-medium">
                          {bid.bidderId.name} {/* Display bidder name */}
                        </TableCell>
                        <TableCell>${bid.bidAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          {new Date(bid.bidTime).toLocaleString()} {/* Use bidTime */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                ) : (
                  <p className="text-gray-500">No bids yet</p>
                )}
              </CardContent>
            </Card>

            {/* Bid Form or Seller Controls */}
            {user?._id != product.ownerId._id && new Date(product.bidEndDate) > new Date() && (
              <Card>
                <CardHeader>
                  <CardTitle>Place a Bid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bidAmount">Your Bid Amount</Label>
                      <Input
                        id="bidAmount"
                        type="number"
                        min={product.currentPrice + 0.01}
                        step="0.01"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Enter amount (min $${(product.currentPrice + 1).toFixed(2)})`}
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
                </CardContent>
              </Card>
            )}

            {user?._id === product.ownerId._id && product.isActive && (
              <div className="p-4 bg-yellow-100 rounded-lg space-y-2 mt-4">
                <h3 className="font-semibold text-lg">Seller Controls </h3>
                <p>You can stop the bidding at any time.</p>
                <Button 
                  variant="destructive"
                  onClick={handleStopAuction}
                >
                  Stop Auction
                </Button>
              </div>
            )}


            {}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/auctions")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal (keep existing implementation) */}
      {isViewerOpen && product.images?.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          {/* ... existing modal code ... */}
        </div>
      )}

      <Footer />
    </>
  );
};

export default AuctionDetails;