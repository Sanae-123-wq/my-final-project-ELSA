import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const generateRecipe = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const openRouterResponse = await axios.post(
            `${process.env.AI_URL}/chat/completions`,
            {
                model: process.env.AI_MODEL,
                messages: [
                    {
                        role: "system",
                        content: `You are a master French Patissier working for ELSA Patisserie. 
User will request a pastry or dessert recipe.
You must respond with ONLY a valid JSON object. Do not include markdown formatting or backticks around the JSON.
The JSON must have the following exact structure:
{
  "name": "String, elegant name of the dessert",
  "ingredients": ["Array of strings", "Each string one ingredient and quantity"],
  "steps": ["Array of strings", "Step by step instructions"]
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
                    'HTTP-Referer': 'http://localhost:5173', // Optional, requested by OpenRouter
                    'X-Title': 'ELSA Patisserie App', // Optional, requested by OpenRouter
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
                return res.status(200).json(recipeData);
            } catch (parseError) {
                console.error("Failed to parse AI response as JSON:", aiText);
                return res.status(500).json({ message: 'AI returned malformed JSON', rawText: aiText });
            }
        } else {
            return res.status(500).json({ message: 'No response from AI model' });
        }
    } catch (error) {
        console.error('Error generating recipe:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error generating recipe with AI', error: error.message });
    }
};
