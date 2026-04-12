import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(`[Protect Middleware] Verifying token...`);

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elsasecret99');
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.warn(`[Protect Middleware] User not found in DB for ID: ${decoded.id}`);
                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }

            next();
        } catch (error) {
            console.error(`[Protect Middleware Error]: ${error.name} - ${error.message}`);

            let message = 'Not authorized, token failed';
            if (error.name === 'TokenExpiredError') message = 'Session expired, please login again';
            if (error.name === 'JsonWebTokenError') message = 'Invalid token session';

            res.status(401).json({ message });
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
