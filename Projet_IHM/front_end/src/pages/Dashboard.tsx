import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content will go here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ongoing Bids</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content will go here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content will go here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}