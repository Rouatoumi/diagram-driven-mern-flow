
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-100 to-pink-100">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-4 text-purple-800">AuctionHub</h4>
            <p className="text-gray-600 mb-4">
              The cutest online auction platform where you can find unique items and place bids on amazing products.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-purple-600 hover:text-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-purple-600 hover:text-pink-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-purple-600 hover:text-pink-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-purple-600 hover:text-pink-600 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-800">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-pink-600 transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-pink-600 transition-colors">How It Works</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-pink-600 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-pink-600 transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-pink-600 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-800">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/categories/electronics" className="text-gray-600 hover:text-pink-600 transition-colors">Electronics</Link></li>
              <li><Link to="/categories/collectibles" className="text-gray-600 hover:text-pink-600 transition-colors">Collectibles</Link></li>
              <li><Link to="/categories/fashion" className="text-gray-600 hover:text-pink-600 transition-colors">Fashion</Link></li>
              <li><Link to="/categories/home" className="text-gray-600 hover:text-pink-600 transition-colors">Home & Garden</Link></li>
              <li><Link to="/categories/art" className="text-gray-600 hover:text-pink-600 transition-colors">Art</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-800">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="text-pink-600 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-600">support@auctionhub.com</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-pink-600 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-600">(123) 456-7890</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-pink-600 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-600">123 Auction Street, City, Country</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-200 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} AuctionHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
