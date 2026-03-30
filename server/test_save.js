import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
dotenv.config();

async function testSave() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testProd = new Product({
            name: 'DEBUG_PRODUCT_' + Date.now(),
            price: 99.99,
            category: 'Pastry',
            vendorId: 'DEBUG_VENDOR'
        });

        const saved = await testProd.save();
        console.log('✅ SAVED TEST PRODUCT:', saved._id);
        
        const found = await Product.findById(saved._id);
        console.log('🔍 VERIFIED IN DB:', found ? 'YES' : 'NO');

        process.exit(0);
    } catch (err) {
        console.error('❌ FAILED TO SAVE:', err);
        process.exit(1);
    }
}

testSave();
