import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const testDelivery = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        console.log('--- USERS ---');
        const deliveryUsers = await db.collection('users').find({ role: 'delivery' }).toArray();
        console.log(`Found ${deliveryUsers.length} delivery users`);
        for (const u of deliveryUsers) {
            console.log(`- ${u.email} (${u._id})`);
        }

        console.log('\n--- ORDERS ---');
        const allOrders = await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(5).toArray();
        console.log(`Last 5 orders:`);
        for (const o of allOrders) {
            console.log(`Order ${o._id} | Status: ${o.status} | Delivery ID: ${o.deliveryId || 'UNASSIGNED'}`);
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        mongoose.disconnect();
    }
};

testDelivery();
