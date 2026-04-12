import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET all stores (now fetching from Users with role 'vendor')
router.get('/', async (req, res) => {
    try {
        // Fetch all approved vendors
        const vendors = await User.find({ role: 'vendor', status: 'approved' });

        const storesWithProducts = await Promise.all(vendors.map(async (vendor) => {
            // Find products belonging to this vendor
            const products = await Product.find({ vendorId: vendor._id });

            return {
                _id: vendor._id,
                name: vendor.shopName,
                location: vendor.city,
                description: vendor.description,
                image: vendor.image,
                phone: vendor.phone,
                materials: products // Maintain 'materials' for frontend compatibility
            };
        }));

        res.json(storesWithProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single store by ID
router.get('/:id', async (req, res) => {
    try {
        const vendor = await User.findById(req.params.id);
        if (!vendor || vendor.role !== 'vendor') {
            return res.status(404).json({ message: 'Store (Vendor) not found' });
        }

        const products = await Product.find({ vendorId: vendor._id });

        res.json({
            _id: vendor._id,
            name: vendor.shopName,
            location: vendor.city,
            description: vendor.description,
            image: vendor.image,
            phone: vendor.phone,
            materials: products
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
