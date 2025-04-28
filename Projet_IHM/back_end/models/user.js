const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    role: { type: String, enum: ['bidder', 'seller', 'admin'], default: 'bidder' },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Generate auth token
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign(
        { _id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
    );
    
    user.tokens = user.tokens.concat({ token });
    await user.save();
    
    return token;
};

// Find user by credentials (for login)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid login credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid login credentials');
    }

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;