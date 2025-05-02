import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Clock } from "lucide-react";
import axios from "axios";

// Dialog components from shadcn
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function MyPost() {
  // Categories (static)
  const categories = [
    { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-800' },
    { name: 'Collectibles', icon: '🏆', color: 'bg-amber-100 text-amber-800' },
    { name: 'Fashion', icon: '👗', color: 'bg-pink-100 text-pink-800' },
    { name: 'Home & Garden', icon: '🏡', color: 'bg-green-100 text-green-800' },
    { name: 'Art', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
    { name: 'Toys & Games', icon: '🎮', color: 'bg-indigo-100 text-indigo-800' }
  ];

  // Auctions fetched from backend
  const [featuredAuctions, setFeaturedAuctions] = useState([]);

  // For popup (dialog)
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    // Fetch products
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => {
        console.log("Fetched products:", response.data);
        const mappedAuctions = response.data.map((product) => ({
          id: product._id,
          title: product.name,
          category: product.category || "General",
          currentBid: product.startingPrice || 0,
          timeLeft: "3 days",
          image: product.image || "https://via.placeholder.com/400x300?text=No+Image",
        }));
        setFeaturedAuctions(mappedAuctions);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Handle bid submit
  const handleBidSubmit = () => {
    console.log("Bid submitted for", selectedAuction.title, "amount:", bidAmount);
    // You can call API to submit bid here
    setBidAmount("");
    setSelectedAuction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Featured Auctions */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Auctions</h2>
              <p className="text-gray-600">Current hot items you might be interested in</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAuctions.map((auction) => (
              <Card key={auction.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/auctions/${auction.id}`} className="block">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img 
                      src={auction.image} 
                      alt={auction.title}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                    <Badge className="absolute top-2 left-2 bg-pink-500">{auction.category}</Badge>
                  </div>
                </Link>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xl">{auction.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} />
                    <span>Ends in {auction.timeLeft}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Current Bid</div>
                      <div className="font-bold text-lg">${auction.currentBid.toFixed(2)}</div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Heart size={16} />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        onClick={() => setSelectedAuction(auction)}
                      >
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      {selectedAuction && (
                        <>
                          <DialogHeader>
                            <DialogTitle>Place Your Bid</DialogTitle>
                            <DialogDescription>
                              You're bidding on <strong>{selectedAuction.title}</strong>. Enter your offer below.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            <Input 
                              type="number" 
                              placeholder="Your bid amount" 
                              value={bidAmount} 
                              onChange={(e) => setBidAmount(e.target.value)} 
                            />
                          </div>
                          <DialogFooter className="mt-4">
                            <Button onClick={handleBidSubmit}>Submit Bid</Button>
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
