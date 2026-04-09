import mongoose from 'mongoose';
import 'dotenv/config';
import Product from './models/Product.js';

const MONGO_URI = process.env.MONGO_URI;

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const mapping = {
            'Cake': 'Cakes',
            'Pastry': 'Viennoiseries',
            'Traditional': 'Moroccan Sweets',
            'Cookies': 'Cookies/Brownies',
            'Chocolate': 'Chocolates'
        };

        for (const [oldCat, newCat] of Object.entries(mapping)) {
            const result = await Product.updateMany({ category: oldCat }, { $set: { category: newCat } });
            console.log(`Updated ${result.modifiedCount} products from "${oldCat}" to "${newCat}"`);
        }

        const remaining = await Product.distinct('category');
        console.log('Final categories in database:', remaining);

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
