import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Order from './models/Order.js';
import User from './models/User.js';

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        // 1. Create a dummy delivery worker
        const worker = new User({
            name: 'Deletable Worker',
            email: `delete_${Date.now()}@test.com`,
            password: 'password123',
            role: 'delivery',
            status: 'approved'
        });
        await worker.save();
        console.log(`Worker created: ${worker._id}`);

        // 2. Create a dummy order assigned to them
        const order = new Order({
            userId: new mongoose.Types.ObjectId(), // Mock client
            products: [{ productId: new mongoose.Types.ObjectId(), quantity: 1, price: 100 }],
            totalAmount: 100,
            deliveryId: worker._id,
            status: 'picked' // Active status
        });
        await order.save();
        console.log(`Order created and assigned: ${order._id}`);

        // 3. Simulate the logic from admin.routes.js
        console.log('Simulating deletion and re-pooling...');
        await Order.updateMany(
            { deliveryId: worker._id, status: { $nin: ['delivered', 'cancelled'] } },
            { $unset: { deliveryId: "" } }
        );
        await User.findByIdAndDelete(worker._id);

        // 4. Verify
        const updatedOrder = await Order.findById(order._id);
        const deletedWorker = await User.findById(worker._id);

        if (!deletedWorker && updatedOrder.deliveryId === undefined) {
            console.log('✅ Verification SUCCESS: Worker deleted and order re-pooled (deliveryId is undefined)');
        } else {
            console.error('❌ Verification FAILED');
            console.log('Worker still exists:', !!deletedWorker);
            console.log('Order deliveryId:', updatedOrder.deliveryId);
        }

        // Cleanup
        await Order.findByIdAndDelete(order._id);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

verify();
