import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const products = await db.collection('products').find({}).toArray();
        console.log(`Checking ${products.length} products...`);
        
        let updateCount = 0;
        for (const p of products) {
            let updateObj = {};
            if (typeof p.vendorId === 'string' && p.vendorId.length === 24) {
                updateObj.vendorId = new mongoose.Types.ObjectId(p.vendorId);
            }
            if (typeof p.storeId === 'string' && p.storeId.length === 24) {
                updateObj.storeId = new mongoose.Types.ObjectId(p.storeId);
            }
            
            if (Object.keys(updateObj).length > 0) {
                await db.collection('products').updateOne({ _id: p._id }, { $set: updateObj });
                updateCount++;
            }
        }
        
        console.log(`✅ Succesfully converted IDs for ${updateCount} products.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();
