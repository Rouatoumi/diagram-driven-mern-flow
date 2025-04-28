const Bid = require('../models/bid');

exports.createBid = async (req, res) => {
    try {
        const bid = new Bid({
            productId: req.body.productId,
            bidderId: req.body.bidderId,
            bidAmount: req.body.bidAmount,
            bidTime: req.body.bidTime,
            isWinningBid: req.body.isWinningBid
        });
        await bid.save();
        res.status(201).json(bid);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllBids = async (req, res) => {
    try {
        const bids = await Bid.find();
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBidById = async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.id);
        if (!bid) return res.status(404).json({ message: 'Bid not found' });
        res.json(bid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBid = async (req, res) => {
    try {
        const bid = await Bid.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!bid) return res.status(404).json({ message: 'Bid not found' });
        res.json(bid);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBid = async (req, res) => {
    try {
        const bid = await Bid.findByIdAndDelete(req.params.id);
        if (!bid) return res.status(404).json({ message: 'Bid not found' });
        res.json({ message: 'Bid deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
