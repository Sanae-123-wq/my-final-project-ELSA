import express from 'express';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const router = express.Router();

// GET all admins (no passwords)
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

export default router;
