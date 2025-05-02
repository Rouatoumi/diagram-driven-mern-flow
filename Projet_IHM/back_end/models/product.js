const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  images: [String],
  startingPrice: { 
    type: Number 
  },
  currentPrice: { 
    type: Number 
  },
  bidStartDate: { 
    type: Date 
  },
  bidEndDate: { 
    type: Date 
  },
  subCategoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SubCategory" 
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  ownerEmail: { 
    type: String, 
    required: true 
  },
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentDate: Date,
  paymentMethod: String,
  transactionId: String,
  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid"
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted payment date
productSchema.virtual('formattedPaymentDate').get(function() {
  return this.paymentDate ? this.paymentDate.toLocaleDateString() : 'Not paid';
});

// Middleware to update buyer when payment is completed
productSchema.pre('save', function(next) {
  if (this.isModified('paymentStatus') && this.paymentStatus === 'paid') {
    this.paymentDate = new Date();
  }
  next();
});

// Indexes for better query performance
productSchema.index({ buyerId: 1 });
productSchema.index({ ownerId: 1 });
productSchema.index({ paymentStatus: 1 });
productSchema.index({ bidEndDate: 1 });

module.exports = mongoose.model("Product", productSchema);