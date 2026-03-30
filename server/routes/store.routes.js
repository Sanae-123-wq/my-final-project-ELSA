import express from 'express';
import Store from '../models/Store.js';
import Product from '../models/Product.js';

const router = express.length === 0 ? express() : express.Router();

// GET all stores
router.get('/', async (req, res) => {
    try {
        const stores = await Store.find();
        
        // Fetch products for each store to match the previous mock structure if needed
        const storesWithProducts = await Promise.all(stores.map(async (store) => {
            const products = await Product.find({ storeId: store._id });
            return {
                ...store._doc,
                materials: products // The frontend expects 'materials' field for the stores page
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
        const store = await Store.findById(req.params.id);
        if (!store) return res.status(404).json({ message: 'Store not found' });
        
        const products = await Product.find({ storeId: store._id });
        res.json({ ...store._doc, materials: products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
