
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyPost() {
  // Featured categories
  const categories = [
    { name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-800' },
    { name: 'Collectibles', icon: '🏆', color: 'bg-amber-100 text-amber-800' },
    { name: 'Fashion', icon: '👗', color: 'bg-pink-100 text-pink-800' },
    { name: 'Home & Garden', icon: '🏡', color: 'bg-green-100 text-green-800' },
    { name: 'Art', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
    { name: 'Toys & Games', icon: '🎮', color: 'bg-indigo-100 text-indigo-800' }
  ];
  
  // Featured auctions
  const featuredAuctions = [
    { 
      id: '1', 
      title: 'Vintage Polaroid Camera', 
      category: 'Collectibles', 
      currentBid: 120, 
      timeLeft: '2 days', 
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: '2', 
      title: 'Gaming Laptop', 
      category: 'Electronics', 
      currentBid: 850, 
      timeLeft: '5 hours', 
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: '3', 
      title: 'Leather Jacket', 
      category: 'Fashion', 
      currentBid: 75, 
      timeLeft: '1 day', 
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80'
    }
  ];

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
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    Bid Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
     
    </div>
  );
};
