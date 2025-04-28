
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Heart, Clock, User, Tag, Share2, ChevronRight, ImageIcon } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// In a real app, this would come from your API
const mockAuction = {
  id: "1",
  title: "Vintage Polaroid Camera",
  description: "A beautiful vintage Polaroid camera in excellent condition. This classic piece comes with its original case and manual. Perfect for collectors or photography enthusiasts who appreciate the charm of instant film photography.",
  currentBid: 120,
  startingBid: 50,
  minBidIncrement: 5,
  timeLeft: "2 days 5 hours",
  endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  seller: {
    id: "user1",
    name: "Jane Smith",
    rating: 4.8,
    totalSales: 57
  },
  category: "Collectibles",
  condition: "Excellent",
  bids: [
    { amount: 120, user: "user2", time: "2023-04-19T14:30:00Z" },
    { amount: 105, user: "user3", time: "2023-04-18T10:15:00Z" },
    { amount: 85, user: "user4", time: "2023-04-17T18:45:00Z" },
    { amount: 70, user: "user5", time: "2023-04-16T09:20:00Z" },
  ],
  watchCount: 24,
  images: [
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1493097684275-78010f9574fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  ]
};

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const auction = mockAuction; // In a real app, fetch based on ID
  
  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.minBidIncrement);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bidAmount < auction.currentBid + auction.minBidIncrement) {
      toast.error(`Minimum bid is $${auction.currentBid + auction.minBidIncrement}`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real MERN app, you would make an API call to place a bid
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Bid of $${bidAmount} placed successfully!`);
      // Here you would update the auction state with the new bid
    } catch (error) {
      toast.error("Failed to place bid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6 text-gray-500">
          <a href="/" className="hover:text-pink-600">Home</a>
          <ChevronRight size={16} className="mx-1" />
          <a href="/categories" className="hover:text-pink-600">Categories</a>
          <ChevronRight size={16} className="mx-1" />
          <a href={`/categories/${auction.category.toLowerCase()}`} className="hover:text-pink-600">{auction.category}</a>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-gray-700">{auction.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {auction.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="overflow-hidden rounded-lg bg-gray-100 aspect-square">
                        <img 
                          src={image} 
                          alt={`${auction.title} - Image ${index + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:flex">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
            
            <div className="grid grid-cols-5 gap-2 mt-4">
              {auction.images.map((image, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-md overflow-hidden cursor-pointer border-2 hover:border-pink-500"
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Auction Details & Bidding */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 mb-2">{auction.category}</Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleFavorite}
                  className={isFavorited ? "text-pink-600 border-pink-200" : ""}
                >
                  <Heart size={18} className={isFavorited ? "fill-pink-600" : ""} />
                  <span className="ml-1">{isFavorited ? "Favorited" : "Add to Favorites"}</span>
                </Button>
              </div>
              <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>Ends in {auction.timeLeft}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag size={16} />
                  <span>Condition: {auction.condition}</span>
                </div>
              </div>
              <p className="text-gray-700">{auction.description}</p>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{auction.seller.name}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600 ml-1">{auction.seller.rating} ({auction.seller.totalSales} sales)</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Profile</Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Current Bid</div>
                    <div className="text-3xl font-bold">${auction.currentBid.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{auction.bids.length} bids • Starting bid: ${auction.startingBid.toFixed(2)}</div>
                  </div>
                  
                  <form onSubmit={handleBid}>
                    <div className="space-y-2">
                      <Label htmlFor="bidAmount" className="text-sm">Your Bid (Minimum: ${(auction.currentBid + auction.minBidIncrement).toFixed(2)})</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="bidAmount"
                          type="number"
                          className="pl-8"
                          min={auction.currentBid + auction.minBidIncrement}
                          step="0.01"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Place Bid"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{auction.watchCount} people watching</span>
              <Button variant="ghost" size="sm">
                <Share2 size={16} className="mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bid History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Bid History</h2>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600 font-semibold">Bidder</th>
                  <th className="px-6 py-3 text-left text-gray-600 font-semibold">Amount</th>
                  <th className="px-6 py-3 text-left text-gray-600 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {auction.bids.map((bid, index) => (
                  <tr key={index} className={index === 0 ? "bg-pink-50" : ""}>
                    <td className="px-6 py-4">
                      User {bid.user.slice(-4)} {index === 0 && <span className="ml-2 text-pink-600 font-medium">(Highest Bidder)</span>}
                    </td>
                    <td className="px-6 py-4 font-semibold">${bid.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(bid.time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuctionDetail;
