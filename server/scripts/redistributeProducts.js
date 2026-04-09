import mongoose from 'mongoose';
import 'dotenv/config';
import Product from '../models/Product.js';
import User from '../models/User.js';

async function redistribute() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Get all Approved Vendors (the "Stores")
        const vendors = await User.find({ role: 'vendor', status: 'approved' });
        if (vendors.length === 0) {
            console.error('❌ No approved vendors found to distribute to.');
            process.exit(1);
        }
        console.log(`📍 Found ${vendors.length} approved stores for distribution.`);

        // 2. Get all 467 Products
        const products = await Product.find({});
        if (products.length !== 467) {
            console.warn(`⚠️ Warning: Found ${products.length} products instead of the expected 467.`);
        }
        console.log(`📦 Catalog Size: ${products.length} products to redistribute.`);

        // 3. Shuffle products for random but even distribution
        const shuffled = products.sort(() => Math.random() - 0.5);

        // 4. Redistribute Round-Robin
        let updateCount = 0;
        for (let i = 0; i < shuffled.length; i++) {
            const product = shuffled[i];
            const vendor = vendors[i % vendors.length]; // Cycle through vendors

            await Product.findByIdAndUpdate(product._id, {
                vendorId: vendor._id.toString(),
                storeId: vendor._id // Maintain both for architecture compatibility
            });
            updateCount++;
        }

        console.log(`\n🎉 REDISTRIBUTION COMPLETE!`);
        console.log(`✅ Successfully assigned ${updateCount} unique products to ${vendors.length} stores.`);
        console.log(`📊 Average products per store: ~${(updateCount / vendors.length).toFixed(1)}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Redistribution failed:', err);
        process.exit(1);
    }
}

redistribute();
