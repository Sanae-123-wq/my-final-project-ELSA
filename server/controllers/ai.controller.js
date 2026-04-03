import axios from 'axios';
import RecipeHistory from '../models/RecipeHistory.js';

// ─── Helper: Save recipe to history (non-blocking) ───
const saveToHistory = async (prompt, recipe, userId = null) => {
    try {
        await RecipeHistory.create({ prompt, recipe, userId });
        console.log(`[AI Kitchen] ✅ Recipe saved to history: "${recipe.name}"`);
    } catch (err) {
        // Log but never block the response
        console.error('[AI Kitchen] ⚠️ Failed to save recipe to history:', err.message);
    }
};

// ─── POST /api/ai/recipe — Generate a recipe via AI or Mock ───
export const generateRecipe = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        console.log(`[AI Kitchen] Generating recipe for: "${prompt}"`);

        // Check for Mock Mode or missing API Key
        const isMockMode = process.env.MOCK_AI === 'true';
        const isMissingKey = !process.env.AI_KEY || process.env.AI_KEY.includes('YOUR_');

        console.log(`[AI Kitchen] MOCK_AI="${process.env.MOCK_AI}" | AI_KEY=${process.env.AI_KEY ? 'SET ✅' : 'MISSING ❌'} | Mode: ${isMockMode || isMissingKey ? 'MOCK' : 'LIVE AI'}`);

        if (isMockMode || isMissingKey) {
            console.log(`[AI Kitchen] Using MOCK MODE ${isMissingKey ? '(API Key missing)' : ''}`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            const mockRecipe = {
                name: `Artisanal ${prompt.charAt(0).toUpperCase() + prompt.slice(1)}`,
                prepTime: "20 mins",
                bakingTime: "45 mins",
                ingredients: [
                    "250g Premium Flour",
                    "150g Unsalted Butter (chilled)",
                    "100g Fine Sugar",
                    "2 Large Farm Eggs",
                    "1 tsp Madagascar Vanilla Extract",
                    "A pinch of sea salt",
                    "Special ELSA secret spice blend"
                ],
                steps: [
                    "Preheat your oven to 180°C (350°F) and grease your baking tray.",
                    "In a large bowl, cream together the butter and sugar until light and fluffy.",
                    "Slowly incorporate the eggs one at a time, followed by the vanilla extract.",
                    "Sift in the flour and salt, folding gently until just combined.",
                    "Shape the dough according to the desired pastry style.",
                    "Bake for 15-20 minutes until golden brown and fragrant.",
                    "Let it cool completely on a wire rack before serving with a touch of ELSA elegance."
                ]
            };

            // Save mock recipe to history
            await saveToHistory(prompt, mockRecipe);

            return res.status(200).json(mockRecipe);
        }

        const openRouterResponse = await axios.post(
            `${process.env.AI_URL}/chat/completions`,
            {
                model: process.env.AI_MODEL,
                messages: [
                    {
                        role: "system",
                        content: `You are an expert pastry chef for ELSA Patisserie. 
For any recipe, provide a complete structured answer.

Language rules:
- Automatically detect the input language (Arabic, French, English)
- Reply in the same language. 
- If user asks for another language, switch accordingly.
- If multiple languages are requested, separate them clearly.

Response Format:
- You MUST respond with ONLY a valid JSON object. 
- Do not include markdown formatting or backticks around the JSON.
- Ingredients: List all with exact quantities.
- Preparation: Provide step-by-step numbered instructions. Keep steps short, clear, and beginner-friendly.
- Extra: Include estimated preparation time and baking time.

JSON Structure:
{
  "name": "String, elegant name of the dessert",
  "prepTime": "String, estimated preparation time",
  "bakingTime": "String, estimated baking time",
  "ingredients": ["Array of strings"],
  "steps": ["Array of strings"]
}`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.AI_KEY}`,
                    'HTTP-Referer': 'http://localhost:5173',
                    'X-Title': 'ELSA Patisserie App',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (openRouterResponse.data.choices && openRouterResponse.data.choices.length > 0) {
            let aiText = openRouterResponse.data.choices[0].message.content;

            // Clean up possible markdown json blocks
            aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                const recipeData = JSON.parse(aiText);

                // Save AI recipe to history
                await saveToHistory(prompt, recipeData);

                return res.status(200).json(recipeData);
            } catch (parseError) {
                console.error("Failed to parse AI response as JSON:", aiText);
                return res.status(500).json({ message: 'AI returned malformed JSON', rawText: aiText });
            }
        } else {
            return res.status(500).json({ message: 'No response from AI model' });
        }
    } catch (error) {
        const errorData = error.response?.data;
        const statusCode = error.response?.status;

        console.error('Error generating recipe:', errorData || error.message);

        if (statusCode === 401) {
            return res.status(401).json({
                message: 'Invalid AI API Key. Please check the AI_KEY in your server/.env file or enable MOCK_AI=true for testing.',
                details: errorData
            });
        }

        res.status(500).json({
            message: 'Error generating recipe with AI',
            error: error.message,
            suggestion: 'If this persists, try enabling MOCK_AI=true in your .env file.'
        });
    }
};

// ─── GET /api/ai/history — Fetch all recipe history ───
export const getRecipeHistory = async (req, res) => {
    try {
        // Optional limit via query param (default: 50)
        const limit = parseInt(req.query.limit) || 50;

        const history = await RecipeHistory.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.status(200).json(history);
    } catch (error) {
        console.error('[AI Kitchen] Error fetching recipe history:', error.message);
        res.status(500).json({ message: 'Failed to fetch recipe history' });
    }
};

// ─── DELETE /api/ai/history/:id — Delete a recipe from history ───
export const deleteRecipeHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await RecipeHistory.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Recipe not found in history' });
        }

        console.log(`[AI Kitchen] 🗑️ Deleted recipe from history: "${deleted.recipe?.name}"`);
        res.status(200).json({ message: 'Recipe deleted from history', id });
    } catch (error) {
        console.error('[AI Kitchen] Error deleting recipe:', error.message);
        res.status(500).json({ message: 'Failed to delete recipe from history' });
    }
};
