const mongoose = require('mongoose');
const Category = require('../models/category');
const Subcategory = require('../models/subCategory');

exports.createSubCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
    
        // 1. Validate categoryId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
          return res.status(400).json({ error: "Invalid category ID" });
        }
    
        // 2. Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(404).json({ error: "Category not found" });
        }
    
        // 3. Create the subcategory
        const newSubcategory = new Subcategory({
          name,
          categoryId, // save the reference
        });
    
        await newSubcategory.save();
    
        res.status(201).json(newSubcategory);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
      }
    };

exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });
        res.json(subCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });
        res.json(subCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
        if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });
        res.json({ message: 'SubCategory deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
