import mongoose from 'mongoose';
import Review from '../models/Review.js';

// Local storage fallback for development/database-offline mode
const localReviews = [];

export const createReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const reviewData = {
      name,
      rating: Number(rating),
      comment,
      isApproved: false,
      createdAt: new Date().toISOString()
    };

    // Try to save to MongoDB
    if (mongoose.connection.readyState === 1) {
      const newReview = new Review(reviewData);
      const savedReview = await newReview.save();
      return res.status(201).json(savedReview);
    } else {
      // Fallback to local memory if DB is down
      console.warn('⚠️ MongoDB is offline. Using local memory fallback for review.');
      const mockSavedReview = { ...reviewData, _id: 'mock_' + Math.random().toString(36).substr(2, 9) };
      localReviews.push(mockSavedReview);
      return res.status(201).json(mockSavedReview);
    }
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

export const getPublicReviews = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(10);
      return res.status(200).json(reviews);
    } else {
      console.warn('⚠️ MongoDB is offline. Fetching from local memory.');
      return res.status(200).json([...localReviews].reverse());
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};
