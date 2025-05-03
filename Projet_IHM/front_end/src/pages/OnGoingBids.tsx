import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { isAfter } from 'date-fns';

type Product = {
  _id: string;
  name: string;
  currentPrice: number;
  bidEndDate: string;
  image?: string;
};

type Bid = {
  _id: string;
  productId: Product | null;
  bidAmount: number;
  bidTime: string;
  status?: 'ongoing' | 'closed'; // Make status optional
  isWinningBid: boolean;
};

export default function OnGoingBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const response = await axios.get('http://localhost:3000/api/bids/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter bids to include only ongoing bids
        const ongoingBids = response.data.bids.filter((bid: Bid) => {
          const bidEndDate = bid.productId?.bidEndDate;
          const isOngoing =
            bid.status === 'ongoing' ||
            (bidEndDate && isAfter(new Date(bidEndDate), new Date()));
          return isOngoing;
        });
        setBids(ongoingBids);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch ongoing bids'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  // Group bids by product and keep only the highest bid for each product
  const highestBidsPerProduct = bids
    .filter(bid => bid.productId !== null)
    .reduce((acc: Record<string, Bid>, bid) => {
      const productId = bid.productId!._id;
      if (!acc[productId] || bid.bidAmount > acc[productId].bidAmount) {
        acc[productId] = bid;
      }
      return acc;
    }, {});

  const highestBids = Object.values(highestBidsPerProduct);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j}>
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button asChild>
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Ongoing Bids</h1>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {highestBids.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-gray-500">You have no ongoing bids.</p>
            <Button asChild>
              <Link to="/products">Browse Available Auctions</Link>
            </Button>
          </div>
        ) : (
          highestBids.map((bid) => {
            const product = bid.productId!;
            const isActive = new Date(product.bidEndDate) > new Date();

            return (
              <Card key={bid._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{product.name}</CardTitle>
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                      {isActive ? 'Active' : 'Ended'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <BidDetail label="Your Highest Bid" value={`$${bid.bidAmount.toFixed(2)}`} />
                    <BidDetail label="Current Price" value={`$${product.currentPrice.toFixed(2)}`} />
                    <BidDetail 
                      label="Ends At" 
                      value={new Date(product.bidEndDate).toLocaleString()} 
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button asChild>
                      <Link to={`/auction_details/${product._id}`}>
                        View Auction Details
                      </Link>
                    </Button>
                    {bid.isWinningBid && (
                      <Badge variant="default">Currently Winning</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function BidDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}