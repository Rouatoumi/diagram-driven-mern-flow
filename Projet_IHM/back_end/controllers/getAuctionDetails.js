const Product = require("../models/product");
const Bid = require("../models/bid");

exports.getAuctionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the product
    const product = await Product.findById(id).populate("owner", "name email");
    if (!product) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Fetch the bids for the product
    const bids = await Bid.find({ productId: id })
      .populate("bidder", "name email")
      .sort({ bidAmount: -1 });

    res.json({
      success: true,
      auction: product,
      bids,
    });
  } catch (error) {
    console.error("Error fetching auction details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};