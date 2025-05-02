const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

router.post('/pay', authMiddleware, paymentController.processPayment);

module.exports = router;