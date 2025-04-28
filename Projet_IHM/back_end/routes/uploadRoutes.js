const express = require('express');
const multer = require('multer');
const uploadImages = require('../controllers/uploadController.js');
const path = require('path');

const router = express.Router();

// Configure multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// router.post('/upload', upload.array('images', 5), uploadImages);
console.log(upload);
router.post('/upload',upload.array('images', 5),uploadImages.uploadImages);
module.exports = router;
