import express from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../models/Product.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// GET all products (with optional category or store filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.storeId) filter.storeId = req.query.storeId;

    const products = await Product.find(filter).populate('storeId').populate('vendorId');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('storeId').populate('vendorId');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product (Vendor/Patissier Only)
router.post('/', protect, vendor, upload.single('image'), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      vendorId: req.user._id,
      image: req.file ? `/uploads/products/${req.file.filename}` : req.body.image
    };

    const product = new Product(productData);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Product creation failed:', err.message);
    if (err.name === 'ValidationError') {
      console.error('Validation Errors:', Object.keys(err.errors).map(key => `${key}: ${err.errors[key].message}`));
    }
    res.status(400).json({ message: err.message });
  }
});

// PUT update product (Vendor Only, Restricted to Own)
router.put('/:id', protect, vendor, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check ownership
    if (product.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.image = `/uploads/products/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (Admin or Owner Vendor)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Allow if admin OR if vendor is the owner
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.vendorId && product.vendorId.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
