import mongoose from 'mongoose';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORY_MAP = {
    'cakes': 'Cakes',
    'cheese cakes': 'Cheesecakes',
    'chocolates': 'Chocolates',
    'cookies br': 'Cookies/Brownies',
    'cupcakes': 'Cupcakes',
    'donuts': 'Donuts',
    'macarrons': 'Macarons',
    'moroccan sweets': 'Moroccan Sweets',
    'tartellettes': 'Tarts',
    'tiramisu sin': 'Tiramisu',
    'viennoiseries': 'Viennoiseries',
};

const ASSETS_ROOT = path.join(__dirname, '../../client/src/assets');

async function cleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Generate the list of canonical image paths (Source of Truth)
        const canonicalPaths = new Set();
        for (const folderName of Object.keys(CATEGORY_MAP)) {
            const folderPath = path.join(ASSETS_ROOT, folderName);
            if (fs.existsSync(folderPath)) {
                const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
                files.forEach(file => canonicalPaths.add(`/src/assets/${folderName}/${file}`));
            }
        }
        console.log(`🔍 Source of Truth: ${canonicalPaths.size} unique artisanal images found in src/assets.`);

        // 2. Identify products NOT in the canonical list
        const allProducts = await Product.find({});
        console.log(`📊 Current Database Count: ${allProducts.length}`);

        let nonCanonicalDeleted = 0;
        let duplicateDeleted = 0;
        const seenPaths = new Set();

        for (const product of allProducts) {
            // A. Check if it's a "non-asset" product (mock data, placeholder, etc.)
            if (!canonicalPaths.has(product.image)) {
                await Product.findByIdAndDelete(product._id);
                nonCanonicalDeleted++;
                continue;
            }

            // B. Check for duplicates (same image path assigned multiple times)
            if (seenPaths.has(product.image)) {
                await Product.findByIdAndDelete(product._id);
                duplicateDeleted++;
                continue;
            }

            seenPaths.add(product.image);
        }

        const finalCount = await Product.countDocuments();
        console.log(`\n🧹 CLEANUP COMPLETE!`);
        console.log(`🗑️ Deleted (non-asset/mock): ${nonCanonicalDeleted}`);
        console.log(`🗑️ Deleted (duplicates): ${duplicateDeleted}`);
        console.log(`📊 Final Total in Database: ${finalCount}`);

        if (finalCount === 467) {
            console.log("⭐ PERFECT: Database now identifies EXACTLY 467 canonical products.");
        } else {
            console.log(`⚠️ Warning: Final count is ${finalCount}. Expected 467.`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
