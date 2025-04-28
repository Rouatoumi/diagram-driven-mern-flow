const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/auth', authController.loginUser);

module.exports = router;