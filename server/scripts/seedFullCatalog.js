import mongoose from 'mongoose';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import User from '../models/User.js';

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

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Get all Approved Vendors
        const vendors = await User.find({ role: 'vendor', status: 'approved' });
        if (vendors.length === 0) {
            console.error('❌ No approved vendors found. Seed some vendors first!');
            process.exit(1);
        }
        console.log(`📍 Found ${vendors.length} approved vendors to share the catalog.`);

        let addedCount = 0;
        let skippedCount = 0;

        // 2. Iterate through each folder
        for (const [folderName, category] of Object.entries(CATEGORY_MAP)) {
            const folderPath = path.join(ASSETS_ROOT, folderName);
            if (!fs.existsSync(folderPath)) {
                console.warn(`⚠️ Folder ${folderName} not found, skipping...`);
                continue;
            }

            const files = fs.readdirSync(folderPath).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
            console.log(`📂 Processing ${folderName} (${files.length} products)...`);

            for (const file of files) {
                const dbPath = `/src/assets/${folderName}/${file}`;
                
                // Check if already exists
                const exists = await Product.findOne({ image: dbPath });
                if (exists) {
                    skippedCount++;
                    continue;
                }

                // Pick a vendor randomly
                const vendor = vendors[Math.floor(Math.random() * vendors.length)];

                // Generate a name from filename (e.g., "cake_01.jpg" -> "Cake 01")
                const cleanName = file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                const finalName = cleanName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                await Product.create({
                    name: finalName,
                    name_fr: finalName, // Fallback for FR
                    name_ar: finalName, // Fallback for AR
                    description: `Delicious artisanal ${category} handcrafted by ${vendor.shopName}. Freshly prepared with the finest ingredients.`,
                    description_fr: `${category} artisanal délicieux préparé par ${vendor.shopName}.`,
                    description_ar: `حلويات ${category} من تحضير ${vendor.shopName}`,
                    price: Math.floor(Math.random() * 45) + 20, // 20 - 65 range
                    image: dbPath,
                    category: category,
                    vendorId: vendor._id.toString(),
                    storeId: vendor._id,
                    stock: Math.floor(Math.random() * 50) + 5,
                    isNewProduct: Math.random() > 0.8,
                    isPopular: Math.random() > 0.8,
                    approvalStatus: 'approved',
                    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
                    numReviews: Math.floor(Math.random() * 100)
                });

                addedCount++;
            }
        }

        const totalCount = await Product.countDocuments();
        console.log(`\n🎉 SEEDING COMPLETE!`);
        console.log(`✅ Newly Added: ${addedCount}`);
        console.log(`⏩ Skipped (already in DB): ${skippedCount}`);
        console.log(`📊 Final Total in Database: ${totalCount}`);

        if (totalCount === 467) {
            console.log("⭐ SUCCESS: Target of 467 products reached!");
        } else {
            console.log(`⚠️ Note: Current count is ${totalCount}. Check if there are other files in the assets directory.`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
