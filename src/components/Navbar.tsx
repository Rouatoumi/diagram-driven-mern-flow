
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, User } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">AuctionHub</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/categories" className="text-gray-700 hover:text-purple-600 transition-colors">Categories</Link>
            <Link to="/auctions" className="text-gray-700 hover:text-purple-600 transition-colors">Auctions</Link>
            <Link to="/sell" className="text-gray-700 hover:text-purple-600 transition-colors">Sell</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors">How It Works</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/search" className="text-gray-700 hover:text-purple-600 transition-colors">
              <Search size={20} />
            </Link>
            <Link to="/favorites" className="text-gray-700 hover:text-purple-600 transition-colors">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-purple-600 transition-colors">
              <ShoppingBag size={20} />
            </Link>
            <Link to="/login">
              <Button variant="outline" className="hidden md:flex items-center gap-2 border-pink-400 text-pink-600 hover:bg-pink-50">
                <User size={16} />
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
