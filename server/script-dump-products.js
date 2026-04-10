import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/elsa');
        const products = await Product.find({}, 'name image category').limit(20);
        console.log(`Found ${products.length} products (showing first 20):`);
        
        products.forEach(p => {
            console.log(`[${p._id}] Name: ${p.name} | Category: ${p.category} | Image: ${p.image}`);
        });

        const total = await Product.countDocuments();
        console.log(`\nTotal products in DB: ${total}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
