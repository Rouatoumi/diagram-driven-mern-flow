/* const Bid = require("../models/bid");

exports.createBid = async (req, res) => {
  try {
    const bid = new Bid({
      productId: req.body.productId,
      bidderId: req.body.bidderId,
      bidAmount: req.body.bidAmount,
      bidTime: req.body.bidTime,
      isWinningBid: req.body.isWinningBid,
    });
    await bid.save();
    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; */

const Bid = require("../models/bid");
const Product = require("../models/product");
const { sendNotificationEmail } = require("../services/emailService");

exports.createBid = async (req, res) => {
  try {
    // Debugging: Log the incoming user data
    console.log("Authenticated user:", req.user);

    // Authentication check (using 'id' from JWT payload)
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Validate required fields
    const { productId, bidAmount } = req.body;
    if (!productId || !bidAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify product exists and get owner email
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate bid amount
    if (bidAmount <= product.currentPrice) {
      return res.status(400).json({
        message: `Bid must be higher than $${product.currentPrice.toFixed(2)}`,
      });
    }

    // Create bid with bidderId from JWT
    const bid = new Bid({
      productId,
      bidderId: req.user.id, // Using id from token
      bidAmount,
      bidTime: new Date(),
    });
    await bid.save();

    // Update product price
    product.currentPrice = bidAmount;
    await product.save();

    // Send notification (with error handling)
    try {
      await sendNotificationEmail({
        productName: product.name,
        productId: product._id,
        bidAmount,
        ownerEmail: product.ownerEmail,
        bidderEmail: req.user.email, // Ensure your JWT includes email
      });
    } catch (emailError) {
      console.error("Notification failed:", emailError);
      // Continue even if notification fails
    }

    // Successful response
    res.status(201).json({
      message: "Bid placed successfully",
      bid: {
        id: bid._id,
        amount: bid.bidAmount,
        product: product.name,
        bidderId: req.user.id,
      },
    });
  } catch (error) {
    console.error("Bid creation error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
// ... rest of your existing bidController code

exports.getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find();
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });
    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBid = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bid) return res.status(404).json({ message: "Bid not found" });
    res.json(bid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndDelete(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });
    res.json({ message: "Bid deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
