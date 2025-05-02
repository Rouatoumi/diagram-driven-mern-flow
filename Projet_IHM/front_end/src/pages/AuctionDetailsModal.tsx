import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
  DialogPortal
} from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function AuctionDetailsModal({ auctionId, isOpen, onClose }) {
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && auctionId) {
      const fetchAuctionDetails = async () => {
        try {
          const response = await axios.get(`/api/auctions/${auctionId}`);
          setAuction(response.data.auction);
          setBids(response.data.bids);
        } catch (error) {
          console.error("Error fetching auction details:", error);
          toast({
            title: "Error",
            description: "Failed to load auction details",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchAuctionDetails();
    }
  }, [auctionId, isOpen]);

  const handlePlaceBid = async () => {
    try {
      const response = await axios.post("/api/bids", {
        productId: auction._id,
        bidAmount: Number(bidAmount),
      });

      toast({
        title: "Bid Successful",
        description: "Your bid has been placed successfully!",
        variant: "default",
      });

      // Refresh bids
      setBids((prevBids) => [response.data.bid, ...prevBids]);
      setBidAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to place bid",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <Dialog open>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <DialogTitle className="text-lg font-medium">Loading auction...</DialogTitle>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50" />
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-xl font-bold mb-4">{auction.name}</DialogTitle>
          
          <img
            src={auction.image || "/placeholder.png"}
            alt={auction.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />

          <p><strong>Starting Price:</strong> ${auction.startingPrice.toFixed(2)}</p>
          <p><strong>Current Price:</strong> ${auction.currentPrice.toFixed(2)}</p>
          <p><strong>Owner:</strong> {auction.owner?.name || "Unknown"}</p> {/* Safe access */}
          <p><strong>End Time:</strong> {new Date(auction.bidEndDate).toLocaleString()}</p>

          <h3 className="mt-4 font-semibold">Bid History</h3>
          {bids.length === 0 ? (
            <p>No bids yet.</p>
          ) : (
            <ul className="space-y-2 mt-2">
              {bids.map((bid) => (
                <li key={bid._id} className="flex justify-between">
                  <strong>{bid.bidder?.name || "Anonymous"}</strong> {/* Safe access */}
                  <span>${bid.bidAmount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-6 font-semibold">Place Your Bid</h3>
          <Input
            type="number"
            min={auction.currentPrice + 1}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Min $${(auction.currentPrice + 1).toFixed(2)}`}
            className="mt-2 mb-4"
          />

          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              onClick={handlePlaceBid} 
              disabled={!bidAmount || Number(bidAmount) <= auction.currentPrice}
              className="flex-1"
            >
              Place Bid
            </Button>
          </div>

        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
