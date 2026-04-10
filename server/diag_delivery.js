import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/User.js';
import Order from './models/Order.js';

async function diagnose() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        const deliveryWorkers = await User.find({ role: { $in: ['delivery', 'Delivery'] } });
        console.log(`\n--- Delivery Workers (${deliveryWorkers.length}) ---`);
        deliveryWorkers.forEach(w => console.log(`ID: ${w._id}, Name: ${w.name}, Email: ${w.email}, Created: ${w.createdAt}`));

        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
        console.log(`\n--- Recent Orders ---`);
        recentOrders.forEach(o => {
            console.log(`ID: ${o._id}, Status: ${o.status}, DeliveryId: ${o.deliveryId}, Created: ${o.createdAt}`);
        });

        const readyOrders = await Order.find({ status: 'ready' });
        console.log(`\n--- Ready Orders (${readyOrders.length}) ---`);
        readyOrders.forEach(o => {
            console.log(`ID: ${o._id}, DeliveryId: ${o.deliveryId}`);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

diagnose();
