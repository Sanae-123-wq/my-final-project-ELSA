import express from 'express';
import { createReview, getPublicReviews } from '../controllers/review.controller.js';

const router = express.Router();

router.post('/', createReview);
router.get('/', getPublicReviews);

export default router;
