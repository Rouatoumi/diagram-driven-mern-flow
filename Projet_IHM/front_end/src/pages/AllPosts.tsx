import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Heart, Clock } from "lucide-react";
import axios from "axios";

export default function AllPost() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  ;

   function handlePlaceBid(product) {
    console.log('Placing bid for product:', product);
    const user = localStorage.getItem('user')// TODO: replace with actual logged-in user ID
    const bidder = user ? JSON.parse(user) : null;
    console.log('product:', product);
    const bidAmount = product.currentPrice + product.startingPrice /10; // Example: +1 over current bid
  
    axios.post('http://localhost:3000/api/bids', {
      productId: product._id,
      bidderId: bidder._id,
      bidAmount: bidAmount
    })
    .then(response => {
      console.log('Bid placed successfully!', response.data);
      alert('Bid placed successfully!');
    })
    .catch(error => {
      console.error('Error placing bid:', error);
      alert('Failed to place bid.');
    });
  } 

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Auctions</h2>
              <p className="text-gray-600">Current hot items you might be interested in</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/auctions/${product._id}`} className="block">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'} 
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                    <Badge className="absolute top-2 left-2 bg-pink-500">{product.name}</Badge>
                  </div>
                </Link>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-gray-600">
                    <Clock size={14} />
                    <span>
                      Ends {new Date(product.bidEndDate).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Current Bid</div>
                      <div className="font-bold text-lg">${product.currentPrice?.toFixed(2) || product.startingPrice?.toFixed(2)}</div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Heart size={16} />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => handlePlaceBid(product)}
                  >
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
}
