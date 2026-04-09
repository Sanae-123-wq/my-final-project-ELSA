import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'elsasecret99', { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
export const signupUser = async (req, res) => {
    try {
        const { name, email, password, role, ...extraData } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const assignedRole = role || 'client';
        const assignedStatus = (assignedRole === 'client') ? 'approved' : 'pending';

        // ─── Vendor Validation & Data ───
        if (assignedRole === 'vendor') {
            const { shopName, description, city } = extraData;
            const image = req.file ? `/uploads/vendors/${req.file.filename}` : null;

            if (!shopName || !description || !city || !image) {
                return res.status(400).json({ 
                    message: 'All store fields (Name, Description, Location, and Image) are mandatory for vendors.' 
                });
            }
            extraData.image = image;
        }

        const user = await User.create({
            name,
            email,
            password,
            role: assignedRole,
            status: assignedStatus,
            ...extraData
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
};
