import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function findTiramisu() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        const products = await db.collection('products').find({ name: /tiramisu/i }).toArray();
        if (products.length > 0) {
            console.log(`✅ FOUND ${products.length} product(s) matching "tiramisu":`);
            products.forEach(p => {
                console.log(`- Name: ${p.name}`);
                console.log(`  ID (Hex): ${p._id}`);
                console.log(`  Database: ${mongoose.connection.name}`);
                console.log(`  Collection: products`);
                console.log(`  CreatedAt: ${p.createdAt}`);
            });
        } else {
            console.log('❌ NOT FOUND in elsa-patisserie.products');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findTiramisu();
