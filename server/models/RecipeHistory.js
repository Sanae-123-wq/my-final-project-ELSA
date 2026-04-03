import mongoose from 'mongoose';

// RecipeHistory Schema — stores every AI-generated recipe
const recipeHistorySchema = new mongoose.Schema({
  // The original prompt the user typed
  prompt: {
    type: String,
    required: true,
    trim: true
  },

  // The full recipe object returned by AI (or mock)
  recipe: {
    name: { type: String, required: true },
    prepTime: { type: String },
    bakingTime: { type: String },
    ingredients: [{ type: String }],
    steps: [{ type: String }]
  },

  // Optional: link to authenticated user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Timestamp — indexed for fast sorting
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const RecipeHistory = mongoose.model('RecipeHistory', recipeHistorySchema);
export default RecipeHistory;
