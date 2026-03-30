import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const newestDelivery = await db.collection('users').find({ role: 'delivery' }).sort({ createdAt: -1 }).limit(1).toArray();
    const worker = newestDelivery[0];
    console.log('Newest Delivery Worker:', worker.email, worker._id);
    const result = await db.collection('orders').updateMany({ status: 'ready' }, { $set: { deliveryId: worker._id } });
    console.log('Re-assigned', result.modifiedCount, 'ready orders to', worker.email);
    process.exit(0);
}).catch(console.error);
