
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AuctionHub</h1>
          <div className="flex gap-4">
            <Button variant="outline">Sign In</Button>
            <Button>Sign Up</Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Welcome to AuctionHub</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find unique items, place bids, and win amazing products at the best prices.
          </p>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold mb-6">Featured Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Electronics', 'Collectibles', 'Fashion', 'Home & Garden'].map((category) => (
            <Card key={category} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Explore {category.toLowerCase()} items</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Browse</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Featured Auctions */}
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white mt-8 rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold mb-8">Featured Auctions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Vintage Camera', category: 'Collectibles', currentBid: 120, timeLeft: '2 days' },
            { title: 'Gaming Laptop', category: 'Electronics', currentBid: 850, timeLeft: '5 hours' },
            { title: 'Leather Jacket', category: 'Fashion', currentBid: 75, timeLeft: '1 day' },
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Current Bid:</span>
                    <span className="font-semibold">${item.currentBid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Left:</span>
                    <span className="font-semibold text-orange-600">{item.timeLeft}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Place Bid</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to start bidding?</h3>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users who find and win unique items every day.
        </p>
        <Button size="lg">Get Started Now</Button>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">AuctionHub</h4>
              <p className="text-gray-300">
                The premier platform for online auctions and bidding.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">How It Works</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">
                Email: info@auctionhub.com<br />
                Phone: (123) 456-7890
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AuctionHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
