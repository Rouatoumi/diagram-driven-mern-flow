
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock data for auctions
const mockAuctions = [
  {
    id: "1",
    title: "Vintage Polaroid Camera",
    category: "Collectibles",
    currentBid: 120,
    timeLeft: "2 days 5 hours",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    bids: 8
  },
  {
    id: "2",
    title: "Gaming Laptop (2023 Model)",
    category: "Electronics",
    currentBid: 850,
    timeLeft: "5 hours 23 minutes",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    bids: 12
  },
  {
    id: "3",
    title: "Vintage Leather Jacket",
    category: "Fashion",
    currentBid: 75,
    timeLeft: "1 day 12 hours",
    imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    bids: 5
  },
  {
    id: "4",
    title: "Antique Wooden Desk",
    category: "Home & Garden",
    currentBid: 320,
    timeLeft: "3 days 9 hours",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    bids: 4
  },
  {
    id: "5",
    title: "Limited Edition Vinyl Record",
    category: "Collectibles",
    currentBid: 45,
    timeLeft: "8 hours 17 minutes",
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca91d0af6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    bids: 7
  },
  {
    id: "6",
    title: "Professional DSLR Camera",
    category: "Electronics",
    currentBid: 1250,
    timeLeft: "4 days 2 hours",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    bids: 20
  },
  {
    id: "7",
    title: "Handcrafted Ceramic Vase",
    category: "Home & Garden",
    currentBid: 85,
    timeLeft: "1 day 20 hours",
    imageUrl: "https://images.unsplash.com/photo-1578913685467-79e72f038686?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    bids: 9
  },
  {
    id: "8",
    title: "Designer Handbag",
    category: "Fashion",
    currentBid: 590,
    timeLeft: "2 days 15 hours",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    bids: 15
  }
];

const Auctions = () => {
  const [auctions, setAuctions] = useState(mockAuctions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter and sort auctions (this would typically be done on the server)
  useEffect(() => {
    let filtered = [...mockAuctions];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(auction =>
        auction.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(auction =>
        auction.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply sort
    switch (sortBy) {
      case "price-high":
        filtered.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case "price-low":
        filtered.sort((a, b) => a.currentBid - b.currentBid);
        break;
      case "ending-soon":
        // This is a simplified sort - in real app, you'd compare actual dates
        filtered.sort((a, b) => a.timeLeft.localeCompare(b.timeLeft));
        break;
      case "most-bids":
        filtered.sort((a, b) => b.bids - a.bids);
        break;
      default: // newest
        // For this mock, we'll just use the original order
        break;
    }
    
    setAuctions(filtered);
  }, [searchQuery, sortBy, selectedCategory]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Discover Auctions</h1>
          <p className="text-gray-600">
            Browse through our wide selection of auctions and find the perfect item you've been looking for.
          </p>
        </div>
        
        {/* Filters */}
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                  <SelectItem value="most-bids">Most Bids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Auction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {auctions.length > 0 ? (
            auctions.map((auction) => (
              <Card key={auction.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/auctions/${auction.id}`} className="block">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img 
                      src={auction.imageUrl} 
                      alt={auction.title}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                    <Badge className="absolute top-2 left-2 bg-pink-500">{auction.category}</Badge>
                  </div>
                </Link>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{auction.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} />
                    <span>{auction.timeLeft}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Current Bid</div>
                      <div className="font-bold">${auction.currentBid.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{auction.bids} bids</div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Heart size={16} />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
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
      <Footer />
    </>
  );
};

export default Auctions;
