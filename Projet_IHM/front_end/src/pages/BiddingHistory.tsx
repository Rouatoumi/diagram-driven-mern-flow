import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactElement, useState, useEffect } from 'react';
import axios from "axios";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gavel, Lock, History, ArrowUp, Info } from 'lucide-react';

interface ProductInfo {
  _id?: string;
  name?: string;
  currentPrice?: number;
  bidEndDate?: string;
  imageUrl?: string;
  status?: 'ongoing' | 'closed';
}

interface Bid {
  _id?: string;
  productId?: ProductInfo;
  bidAmount?: number;
  bidTime?: string;
  isWinningBid?: boolean;
  status?: 'ongoing' | 'closed';
}

interface ProductBidsData {
  productInfo: ProductInfo;
  bids: Bid[];
  highestBid: number;
  bidCount: number;
}

export default function ClosedAuctions(): ReactElement {
  const { user } = useAuth();
  const [products, setProducts] = useState<Record<string, ProductBidsData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const fetchBids = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get('http://localhost:3000/api/bids/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response?.data?.success || !Array.isArray(response.data.bids)) {
        throw new Error('Invalid data format received from server');
      }

      const groupedData = response.data.bids.reduce((acc: Record<string, ProductBidsData>, bid: Bid) => {
        if (!bid?.productId?._id || bid.status !== 'closed') {
          if (!bid.status) {
            console.warn('Skipping bid with missing status:', bid);
          }
          return acc; // Skip non-closed bids or bids with missing status
        }

        const productId = bid.productId._id;

        if (!acc[productId]) {
          acc[productId] = {
            productInfo: {
              _id: productId,
              name: bid.productId.name || 'Unknown Product',
              currentPrice: bid.productId.currentPrice || 0,
              bidEndDate: bid.productId.bidEndDate,
              imageUrl: bid.productId.imageUrl,
              status: 'closed'
            },
            bids: [],
            highestBid: 0,
            bidCount: 0
          };
        }

        acc[productId].bids.push({
          _id: bid._id,
          productId: bid.productId,
          bidAmount: bid.bidAmount || 0,
          bidTime: bid.bidTime || new Date().toISOString(),
          isWinningBid: bid.isWinningBid || false,
          status: 'closed'
        });

        const bidAmount = bid.bidAmount || 0;
        if (bidAmount > acc[productId].highestBid) {
          acc[productId].highestBid = bidAmount;
        }

        acc[productId].bidCount++;
        return acc;
      }, {});

      setProducts(groupedData);
    } catch (err) {
      console.error("Failed to fetch bids:", err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch bids');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchBids();
    }
  }, [user?._id]);

  const selectedProduct = selectedProductId ? products[selectedProductId] : null;

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={fetchBids} />;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Your Closed Auctions</h1>
          <Button asChild>
            <Link to="/posts/new" className="flex items-center gap-2">
              <Gavel className="w-4 h-4" /> New Auction
            </Link>
          </Button>
        </div>

        {Object.keys(products).length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {Object.values(products).map((productData) => (
                <ProductCard 
                  key={productData.productInfo._id || 'unknown'}
                  productData={productData}
                  onViewBids={() => setSelectedProductId(productData.productInfo._id || null)}
                />
              ))}
            </div>

            <BidHistoryDrawer 
              productData={selectedProduct}
              isOpen={!!selectedProductId}
              onClose={() => setSelectedProductId(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <Button onClick={onRetry} variant="destructive">
        Try Again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-700">No Closed Auctions</h2>
      <p className="text-gray-500 mt-2 mb-6">You don't have any closed auctions to display yet.</p>
      <Button asChild>
        <Link to="/products" className="flex items-center justify-center gap-2">
          Browse Available Auctions
        </Link>
      </Button>
    </div>
  );
}

function ProductCard({ productData, onViewBids }: { productData: ProductBidsData; onViewBids: () => void }) {
  const productInfo = productData.productInfo || {};
  const isWinning = productData.bids?.some(b => b?.isWinningBid) || false;
  const bidCount = productData.bidCount || 0;
  const highestBid = productData.highestBid || 0;
  const currentPrice = productInfo.currentPrice || 0;
  const endDate = productInfo.bidEndDate ? new Date(productInfo.bidEndDate) : new Date();

  return (
    <Card className="bg-gray-50 border-gray-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {productInfo.name || 'Unknown Product'}
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Closed
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              {bidCount} bid{bidCount !== 1 ? 's' : ''} • Ended {format(endDate, 'MMM dd, yyyy')}
            </CardDescription>
          </div>
          <Badge variant={isWinning ? 'default' : 'secondary'}>
            {isWinning ? (
              <span className="flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Won
              </span>
            ) : 'Closed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Your Highest Bid</p>
            <p className="font-medium text-lg text-gray-700">
              ${highestBid.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Final Price</p>
            <p className="font-medium text-lg">
              ${currentPrice.toFixed(2)}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 bg-gray-100"
          onClick={onViewBids}
        >
          <History className="w-4 h-4 mr-2" /> View Bid Details
        </Button>
      </CardContent>
    </Card>
  );
}

function BidHistoryDrawer({ productData, isOpen, onClose }: { 
  productData: ProductBidsData | null; 
  isOpen: boolean; 
  onClose: () => void 
}) {
  if (!productData) return null;

  const productInfo = productData.productInfo || {};
  const sortedBids = [...(productData.bids || [])].sort((a, b) => {
    const timeA = a.bidTime ? new Date(a.bidTime).getTime() : 0;
    const timeB = b.bidTime ? new Date(b.bidTime).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            {productInfo.name || 'Unknown Product'}
          </DrawerTitle>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm text-gray-500">Final Price</p>
              <p className="font-medium">${(productInfo.currentPrice || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Highest</p>
              <p className="font-medium">${productData.highestBid.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bids</p>
              <p className="font-medium">{productData.bidCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant="secondary">Closed</Badge>
            </div>
          </div>
        </DrawerHeader>
        
        <div className="p-4 overflow-y-auto">
          <h3 className="font-medium mb-3">Your Bidding Activity</h3>
          <div className="space-y-3">
            {sortedBids.map((bid) => {
              if (!bid) return null;
              
              const isWinning = bid.isWinningBid || false;
              const bidAmount = bid.bidAmount || 0;
              const bidTime = bid.bidTime ? format(new Date(bid.bidTime), 'MMM dd, yyyy h:mm a') : 'Unknown time';

              return (
                <div 
                  key={bid._id || Math.random().toString(36).substring(2, 9)}
                  className={`p-3 rounded-lg border ${
                    isWinning 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        ${bidAmount.toFixed(2)}
                        {isWinning && (
                          <Badge className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> Winning
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {bidTime}
                      </p>
                    </div>
                    {bidAmount === productData.highestBid && (
                      <ArrowUp className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {!isWinning && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Info className="w-3 h-3" /> Auction closed without winning
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <DrawerClose asChild>
            <Button className="w-full">Close</Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}