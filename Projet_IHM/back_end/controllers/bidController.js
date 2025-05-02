const Bid = require("../models/bid");
const Product = require("../models/product");
const { sendNotificationEmail } = require("../services/emailService");

// Create a new bid
const createBid = async (req, res) => {
  try {
  //   // Authentication check
  //   if (!req.user?._id) {
  //     return res.status(401).json({ message: "Authentication required" });
  //   }

  //   // Validate required fields
  //   const { productId, bidAmount } = req.body;
  //   if (!productId || !bidAmount) {
  //     return res.status(400).json({ message: "Missing required fields" });
  //   }

  //   // Verify product exists
  //   const product = await Product.findById(productId);
  //   if (!product) {
  //     return res.status(404).json({ message: "Product not found" });
  //   }

  //   // Check if bidding period is active
  //   const now = new Date();
  //   if (now < new Date(product.bidStartDate)) {
  //     return res.status(400).json({ message: "Bidding has not started yet" });
  //   }
  //   if (now > new Date(product.bidEndDate)) {
  //     return res.status(400).json({ message: "Bidding has ended" });
  //   }

  //   // Validate bid amount
  //   if (bidAmount <= product.currentPrice) {
  //     return res.status(400).json({
  //       message: `Bid must be higher than current price ($${product.currentPrice.toFixed(2)})`,
  //       currentPrice: product.currentPrice
  //     });
  //   }
  const { productId } = req.params;
  const { bidAmount } = req.body;
  // const user = localStorage.getItem('user')
  console.log("req:", req);
  const userId = req.user.id;
  const userName = req.user.name;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
    // Create new bid
    const bid = new Bid({
      productId,
      bidderId: userId,
      bidderName: userName,
      bidAmount,
      bidTime: new Date()
    });
    await bid.save();

    // Update product price
    product.currentPrice = bidAmount;
    await product.save();

    // Send notification (if configured)
    if (sendNotificationEmail) {
      try {
        await sendNotificationEmail({
          productName: product.name,
          productId: product._id,
          bidAmount,
          ownerEmail: product.ownerEmail,
          bidderEmail: req.user.email
        });
      } catch (emailError) {
        console.error("Notification email failed:", emailError);
      }
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      bid: {
        id: bid._id,
        amount: bid.bidAmount,
        product: product.name,
        productId: product._id,
        bidTime: bid.bidTime
      },
      currentPrice: product.currentPrice
    });

  } catch (error) {
    console.error("Bid creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get all bids (admin only)
const  getAllBids = async (req, res) => {
  try {
    // if (!req.user?.isAdmin) {
    //   return res.status(403).json({ message: "Admin access required" });
    // }

    const bids = await Bid.find()
      .populate('productId', 'name')
      .populate('bidderId', 'name email')
      .sort({ bidTime: -1 });
      
    res.json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get a single bid
const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('productId', 'name')
      .populate('bidderId', 'name email');

    if (!bid) {
      return res.status(404).json({ 
        success: false,
        message: 'Bid not found' 
      });
    }

    // Only allow bidder or admin to view bid
    if (bid.bidderId._id.toString() !== req.user?.id?.toString() && !req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this bid' 
      });
    }

    res.json({
      success: true,
      bid
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a bid (admin only)
const updateBid = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const bid = await Bid.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('productId', 'name')
    .populate('bidderId', 'name email');

    if (!bid) {
      return res.status(404).json({ 
        success: false,
        message: 'Bid not found' 
      });
    }

    res.json({
      success: true,
      message: 'Bid updated successfully',
      bid
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a bid (admin only)
const deleteBid = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    const bid = await Bid.findByIdAndDelete(req.params.id);

    if (!bid) {
      return res.status(404).json({ 
        success: false,
        message: 'Bid not found' 
      });
    }

    res.json({
      success: true,
      message: 'Bid deleted successfully',
      deletedBid: bid
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get bids for current user
const getMyBids = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    const bids = await Bid.find({ bidderId: req.user.id })
      .populate('productId', 'name currentPrice bidEndDate')
      .sort({ bidTime: -1 });

    res.json({
      success: true,
      count: bids.length,
      bids
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBidsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Get bids count for pagination
    const totalBids = await Bid.countDocuments({ productId });

    // Get paginated bids for this product
    const bids = await Bid.find({ productId })
      .populate('bidderId', 'name email')
      .sort({ bidAmount: -1, bidTime: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: bids.length,
      totalBids,
      totalPages: Math.ceil(totalBids / limit),
      currentPage: page,
      bids
    });

  } catch (error) {
    console.error('Error fetching bids by product ID:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  createBid,
  getAllBids,
  getBidsByProductId,  // Make sure this matches your function name
  getBidById,
  updateBid,
  deleteBid,
  getMyBids
  // Remove getBidsForProduct if you're not using it
};