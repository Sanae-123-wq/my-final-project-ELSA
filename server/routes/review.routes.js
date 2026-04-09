import express from 'express';
import { createReview, getPublicReviews } from '../controllers/review.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/', getPublicReviews);

export default router;
