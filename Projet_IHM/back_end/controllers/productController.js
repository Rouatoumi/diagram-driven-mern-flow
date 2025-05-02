const Product = require('../models/product');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { 
      name,
      description,
      images,
      startingPrice,
      bidStartDate,
      bidEndDate,
      subCategoryId,
      ownerId,
      ownerEmail,
      buyerId
    } = req.body;

    const product = new Product({
      name,
      description,
      images,
      startingPrice,
      currentPrice: startingPrice, // Set current price to starting price initially
      bidStartDate,
      bidEndDate,
      subCategoryId,
      ownerId,
      ownerEmail,
      buyerId
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      details: error.errors // This will show validation errors if any
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('subCategoryId')
      .populate('ownerId', 'name email')
      .populate('buyerId', 'name email');
      
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const updates = {
      ...req.body,
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('subCategoryId')
    .populate('ownerId', 'name email')
    .populate('buyerId', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ 
      message: error.message,
      details: error.errors // Shows validation errors
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ 
      message: 'Product deleted successfully',
      deletedProduct: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


