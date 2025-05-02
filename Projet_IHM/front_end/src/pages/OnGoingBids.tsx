import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OnGoingBids() {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get('/api/bids/my-bids', {
          headers: {
           // Authorization: `Bearer ${user?.token}`, // Pass the user's token for authentication
          },
        });
        setBids(response.data.bids);
      } catch (error) {
        console.error('Error fetching ongoing bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Ongoing Bids</h1>
      </div>

      <div className="space-y-4">
        {bids.length === 0 ? (
          <p>You have no ongoing bids.</p>
        ) : (
          bids.map((bid) => (
            <Card key={bid.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{bid.productId.name}</CardTitle>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      new Date(bid.productId.bidEndDate) > new Date()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {new Date(bid.productId.bidEndDate) > new Date()
                      ? 'active'
                      : 'ended'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Your Bid</p>
                    <p className="font-medium">${bid.bidAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Price</p>
                    <p className="font-medium">
                      ${bid.productId.currentPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ends At</p>
                    <p className="font-medium">
                      {new Date(bid.productId.bidEndDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}