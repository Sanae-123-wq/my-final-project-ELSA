import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Collections in database:', collections.map(c => c.name));

        const products = await db.collection('products').find({}).toArray();
        console.log(`Found ${products.length} products in "products" collection.`);
        
        if (products.length > 0) {
            console.log('Recent 3 products:');
            products.slice(-50).forEach(p => {
                console.log(`- [${p.createdAt?.toISOString()}] ID: ${p._id} | Name: ${p.name} | Vendor: ${p.vendorId} | Status: ${p.approvalStatus}`);
            });
        }

        process.exit(0);
    } catch (err) {
        console.error('Error checking products:', err);
        process.exit(1);
    }
}

checkProducts();
