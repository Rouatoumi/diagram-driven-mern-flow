const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

router.post('/subcategories', subCategoryController.createSubCategory);
router.get('/subcategories', subCategoryController.getAllSubCategories);
router.get('/subcategories/:id', subCategoryController.getSubCategoryById);
router.put('/subcategories/:id', subCategoryController.updateSubCategory);
router.delete('/subcategories/:id', subCategoryController.deleteSubCategory);

module.exports = router;
