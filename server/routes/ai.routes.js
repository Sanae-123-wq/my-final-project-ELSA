import express from 'express';
import { generateRecipe, getRecipeHistory, deleteRecipeHistory } from '../controllers/ai.controller.js';

const router = express.Router();

// POST /api/ai/recipe — Generate a new recipe
router.post('/recipe', generateRecipe);

// GET /api/ai/history — Fetch recipe history (most recent first)
router.get('/history', getRecipeHistory);

// DELETE /api/ai/history/:id — Delete a recipe from history
router.delete('/history/:id', deleteRecipeHistory);

export default router;
