import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(`[Protect Middleware] Verifying token for ID decoding...`);
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elsasecret99');
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) console.log(`[Protect Middleware] User not found for ID: ${decoded.id}`);
            next();
        } catch (error) {
            console.error(`[Protect Middleware Error]: ${error.message}`);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'Admin')) {
        next();
    } else {
        console.log(`[Admin Middleware Reject] User Role: ${req.user?.role}`);
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export const vendor = (req, res, next) => {
    if (req.user && (req.user.role === 'vendor' || req.user.role === 'patissier')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a vendor' });
    }
};
