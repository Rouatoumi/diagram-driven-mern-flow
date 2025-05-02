const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
// const auth = require('../middleware/authMiddleware'); // Import the auth middleware
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// Admin-only route
router.get('/bids', auth, bidController.getAllBids);

router.post('/bids/:productId', auth, bidController.createBid);
router.get('/bids', bidController.getAllBids);
router.get('/bids/:id', bidController.getBidById);
router.put('/bids/:id', bidController.updateBid);
router.delete('/bids/:id', bidController.deleteBid);
router.get('/bids/products/:productId', bidController.getBidsByProductId);
module.exports = router;
