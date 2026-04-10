import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const clientSrcPath = path.resolve(__dirname, '../client/src');
const serverUploadsPath = path.resolve(__dirname, './public');

const SYSTEM_PROMPT = `You are a Master Pastry Chef. Analyze the provided image of a pastry/dessert.
Provide a short, elegant, premium name for it in English, French, and Arabic. Do NOT use numbers from the file name. Name the pastry exactly based on its visual content (e.g., "Strawberry Shortcake", "Rich Chocolate Macaron").
You MUST respond with a valid JSON object ONLY. Do not use markdown backticks.
Format:
{
  "name_en": "Delicious Chocolate Cake",
  "name_fr": "Délicieux Gâteau au Chocolat",
  "name_ar": "كعكة الشوكولاتة اللذيذة"
}`;

const delay = ms => new Promise(res => setTimeout(res, ms));

const getLocalImagePath = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('http')) return null;
    if (imgUrl.startsWith('/src/assets')) {
         return path.join(clientSrcPath, imgUrl.replace('/src/', ''));
    }
    if (imgUrl.startsWith('/uploads')) {
         return path.join(serverUploadsPath, imgUrl);
    }
    return null;
}

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elsa');
        console.log("Connected to DB.");

        let productsQuery = Product.find({});
        const products = await productsQuery;
        console.log(`Found ${products.length} products to process via AI Vision...`);

        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            const localPath = getLocalImagePath(p.image);
            
            if (!localPath || !fs.existsSync(localPath)) {
                console.log(`[${i+1}/${products.length}] ⏭️ Skipped (Image missing): ${p.image}`);
                continue;
            }

            try {
                const base64Img = fs.readFileSync(localPath, 'base64');
                const ext = path.extname(localPath).substring(1) || 'jpeg';
                const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
                const dataUrl = `data:${mimeType};base64,${base64Img}`;

                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: 'google/gemini-2.5-flash',
                    max_tokens: 150, // Critical for avoiding 402 Error due to small credit balance
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { 
                            role: 'user', 
                            content: [
                                { type: "text", text: `Category: ${p.category}. What exactly is this specific dessert? Name it appropriately.` },
                                { type: "image_url", image_url: { url: dataUrl } }
                            ] 
                        }
                    ],
                    response_format: { type: "json_object" }
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.AI_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                let content = response.data.choices[0].message.content;
                content = content.replace(/```json/g, '').replace(/```/g, '').trim();
                
                const parsed = JSON.parse(content);
                
                console.log(`[${i+1}/${products.length}] ✅ AI: ${parsed.name_en}`);
                
                p.name = parsed.name_en || p.name;
                p.name_fr = parsed.name_fr || p.name_fr;
                p.name_ar = parsed.name_ar || p.name_ar;
                await p.save();

            } catch (err) {
                console.error(`[${i+1}/${products.length}] ❌ Error for ${p._id}:`, err.response?.data?.error?.message || err.message);
            }

            await delay(800); // Wait 800ms between requests to avoid rate limits
        }

        console.log("\n✅ Done processing all products via AI Vision.");
        process.exit(0);
    } catch (e) {
        console.error("Fatal Error:", e);
        process.exit(1);
    }
}

run();
