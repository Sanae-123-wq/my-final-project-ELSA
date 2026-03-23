import express from 'express';
import { generateRecipe } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/recipe', generateRecipe);

export default router;
