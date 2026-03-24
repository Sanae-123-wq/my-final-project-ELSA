import express from 'express';
import HeroSection from '../models/HeroSection.js';

const router = express.Router();

// GET all hero sections
router.get('/', async (req, res) => {
  try {
    const heroes = await HeroSection.find();
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one hero section
router.get('/:id', async (req, res) => {
  try {
    const hero = await HeroSection.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: 'Not found' });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create hero section
router.post('/', async (req, res) => {
  try {
    const hero = new HeroSection(req.body);
    const saved = await hero.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update hero section
router.put('/:id', async (req, res) => {
  try {
    const updated = await HeroSection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE hero section
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await HeroSection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Hero section deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
