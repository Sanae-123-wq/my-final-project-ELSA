import express from 'express';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import Review from '../models/Review.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET status for debugging
router.get('/verify-admin', protect, admin, (req, res) => {
  res.json({ success: true, user: req.user });
});

// GET all admins (no passwords)
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all active reviews for moderation (MOVED UP for precedence)
router.get('/reviews', protect, admin, async (req, res) => {
    try {
      const reviews = await Review.find({ 
        $or: [
          { deletedAt: null },
          { deletedAt: { $exists: false } }
        ]
      }).sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// PATCH soft-delete/hide review (Admin only) (MOVED UP for precedence)
router.patch('/reviews/:id/soft-delete', protect, admin, async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) return res.status(404).json({ message: 'Review not found' });
  
      review.deletedAt = new Date();
      await review.save();
      res.json({ message: 'Review hidden successfully (soft-deleted)' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});

// GET all users (clients, vendors, delivery)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one admin
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create admin
router.post('/', async (req, res) => {
  try {
    const admin = new Admin(req.body);
    const saved = await admin.save();
    const { password, ...adminData } = saved.toObject();
    res.status(201).json(adminData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST login admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const { password: pwd, ...adminData } = admin.toObject();
    res.json({ message: 'Login successful', admin: adminData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update admin
router.put('/:id', async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    const updated = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'Admin not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH approve pending user
router.patch('/approve-user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.status = 'approved';
    await user.save();
    
    res.json({ message: 'User approved successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE admin
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Admin not found' });
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE vendor (safely remove vendor and their products)
router.delete('/vendors/:id', async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // 1. Delete all products belonging to this vendor
    // Search by vendorId (string) or storeId (ObjectId) if applicable
    await Product.deleteMany({ 
      $or: [
        { vendorId: vendor._id.toString() },
        { storeId: vendor._id }
      ]
    });

    // 2. Delete any matching records in the legacy Store collection
    // Match by name or shopName to handle redundancy
    await Store.deleteMany({ 
      name: { $regex: new RegExp(`^${vendor.shopName || vendor.name}$`, 'i') } 
    });

    // 3. Delete the vendor user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Vendor and associated products deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Re-locating reviews routes above parameterized routes for precedence in a future edit
// (Actually just removing them here to move them up)

export default router;
