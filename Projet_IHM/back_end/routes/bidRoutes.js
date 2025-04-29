const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const auth = require('../middleware/authMiddleware'); // Import the auth middleware


router.post('/bids', auth, bidController.createBid);
router.get('/bids', bidController.getAllBids);
router.get('/bids/:id', bidController.getBidById);
router.put('/bids/:id', bidController.updateBid);
router.delete('/bids/:id', bidController.deleteBid);

module.exports = router;
