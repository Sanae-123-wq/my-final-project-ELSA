import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkDetailed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        console.log('--- LATEST 10 PRODUCTS ---');
        const products = await db.collection('products').find().sort({ _id: -1 }).limit(10).toArray();
        
        for (const p of products) {
            let vendor = null;
            try {
                if (p.vendorId && p.vendorId.length === 24) {
                    vendor = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(p.vendorId) });
                }
            } catch (e) {}
            console.log(`[${p.createdAt}] ${p.name} | Vendor: ${vendor ? vendor.name : p.vendorId} | Category: ${p.category}`);
            console.log(`   Internal ID: ${p._id}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDetailed();
