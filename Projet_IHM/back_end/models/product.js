const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    images: [String],
    startingPrice: { type: Number },
    currentPrice: { type: Number },
    bidStartDate: { type: Date },
    bidEndDate: { type: Date },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Product', productSchema);
