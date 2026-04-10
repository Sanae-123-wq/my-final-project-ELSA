import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/User.js';

async function diag() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const deliveryWorkers = await User.find({ role: 'delivery' });
        
        console.log(`\n--- Found ${deliveryWorkers.length} Delivery Workers ---`);
        deliveryWorkers.forEach((w, i) => {
            console.log(`${i+1}. Name: ${w.name} | Email: ${w.email} | Status: ${w.status} | ID: ${w._id}`);
        });

        const allUsersCount = await User.countDocuments();
        console.log(`\nTotal Users in 'users' collection: ${allUsersCount}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

diag();
