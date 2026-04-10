import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const testOpenRouter = async () => {
    try {
        console.log("Key:", process.env.AI_KEY ? process.env.AI_KEY.substring(0, 15) + "..." : "No Key");
        
        // Get a dummy image to test vision
        const imgPath = path.resolve(__dirname, '../client/src/assets/donuts/d1.jpg');
        const base64Img = fs.readFileSync(imgPath, 'base64');
        const dataUrl = `data:image/jpeg;base64,${base64Img}`;

        const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'google/gemini-2.5-flash', // we can use the 0.5 version which is faster if available
            max_tokens: 150, // CRITICAL FIX for 402 Error
            messages: [{ 
                role: 'user', 
                content: [
                    { type: "text", text: "What pastry is this? Be very brief." },
                    { type: "image_url", image_url: { url: dataUrl } }
                ] 
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.AI_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Response:", res.data.choices[0].message.content);
        console.log("Tokens used:", res.data.usage);
    } catch (e) {
        console.error("Error:", e.response?.status, e.response?.data || e.message);
    }
}

testOpenRouter();
