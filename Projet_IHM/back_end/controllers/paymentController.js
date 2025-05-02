const Product = require('../models/product');
const axios = require('axios');

// Mock bank API URL (you can use a service like Mocky.io for testing)
const MOCK_BANK_API = 'https://run.mocky.io/v3/your-mock-api-endpoint'; 

exports.processPayment = async (req, res) => {
  try {
    const { productId, cardNumber, expiry, cvv, amount } = req.body;
    const userId = req.user._id;

    // 1. Verify the product exists and user is the winner
    const product = await Product.findById(productId)
      .populate('buyerId', '_id');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.buyerId._id.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only the auction winner can pay' });
    }

    // 2. Verify payment amount matches current price
    if (amount !== product.currentPrice) {
      return res.status(400).json({ error: 'Payment amount mismatch' });
    }

    // 3. Call mock bank API
    const bankResponse = await axios.post(MOCK_BANK_API, {
      cardNumber,
      expiry,
      cvv,
      amount,
      merchant: 'AuctionApp'
    });

    if (!bankResponse.data.success) {
      await Product.findByIdAndUpdate(productId, {
        paymentStatus: 'failed'
      });
      return res.status(400).json({ error: 'Payment failed: ' + bankResponse.data.message });
    }

    // 4. Update product payment status
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      paymentStatus: 'paid',
      paymentDate: new Date(),
      paymentMethod: 'card',
      transactionId: bankResponse.data.transactionId
    }, { new: true });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ 
      error: error.response?.data?.message || 'Payment processing failed' 
    });
  }
};