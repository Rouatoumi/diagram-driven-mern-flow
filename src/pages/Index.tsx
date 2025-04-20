
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
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
      {/* Header with Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text mb-6">
              Find Unique Items at Amazing Prices
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover rare collectibles, electronics, fashion, art and more. Start bidding today!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auctions">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  Browse Auctions
                </Button>
              </Link>
              <Link to="/sell">
                <Button size="lg" variant="outline" className="border-pink-400 text-pink-600 hover:bg-pink-50">
                  Sell an Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L60,218.7C120,213,240,203,360,186.7C480,171,600,149,720,149.3C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How AuctionHub Works</h2>
            <p className="text-gray-600">
              Buying and selling on AuctionHub is simple, secure, and fun
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Bid</h3>
              <p className="text-gray-600">
                Browse thousands of auctions and place bids on items you love
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Win & Pay</h3>
              <p className="text-gray-600">
                If you're the highest bidder when the auction ends, you win!
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive & Enjoy</h3>
              <p className="text-gray-600">
                The seller ships your item directly to you
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Categories</h2>
              <p className="text-gray-600">Find what you're looking for by category</p>
            </div>
            <Link to="/categories" className="text-pink-600 hover:text-pink-800 font-medium flex items-center">
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.name} to={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader className="text-center pb-2">
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Badge className={`w-full justify-center ${category.color}`}>
                      Explore
                    </Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Auctions */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Auctions</h2>
              <p className="text-gray-600">Current hot items you might be interested in</p>
            </div>
            <Link to="/auctions" className="text-pink-600 hover:text-pink-800 font-medium flex items-center">
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
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
      
      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to start bidding?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who find and win unique items every day.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/auctions">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-purple-700">
                  Browse Auctions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
