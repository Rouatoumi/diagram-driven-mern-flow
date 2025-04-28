const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log(email);
        console.log(user);
        if (!user) {
           
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch =password == user.password;
        if (!isMatch) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Omit password from response
        const userData = user.toObject();
        delete userData.password;
        delete userData.tokens;
        console.log('Login successful');
        res.json({ 
            message: 'Login successful',
            user: userData,
            token 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};