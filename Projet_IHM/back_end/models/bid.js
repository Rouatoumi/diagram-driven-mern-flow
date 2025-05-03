const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bidderName: { type: String },
  bidAmount: { type: Number },
  bidTime: { type: Date, default: Date.now },
  isWinningBid: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ["ongoing", "closed"],
    default: "ongoing"
  }
});

module.exports = mongoose.model("Bid", bidSchema);
