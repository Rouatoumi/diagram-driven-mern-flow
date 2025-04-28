import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock data - replace with real data from your API
const mockPosts = [
  {
    id: '1',
    title: 'Vintage Camera',
    status: 'active',
    currentBid: 120,
    bids: 5,
    endDate: '2023-12-15'
  },
  {
    id: '2',
    title: 'Gaming Laptop',
    status: 'sold',
    currentBid: 850,
    bids: 12,
    endDate: '2023-11-30'
  }
];

export default function OnGoingBids() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Auction Posts</h1>
        <Button asChild>
          <Link to="/posts/new">Create New Post</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {mockPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{post.title}</CardTitle>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {post.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="font-medium">${post.currentBid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bids</p>
                  <p className="font-medium">{post.bids}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ends At</p>
                  <p className="font-medium">{post.endDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}