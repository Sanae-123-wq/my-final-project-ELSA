import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const ASSETS_STORES_DIR = path.join(__dirname, '../client/src/assets/stores profils');

const normalize = (str) => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

const formatName = (filename) => {
    let name = path.parse(filename).name;
    name = name.replace(/[_-]/g, ' ');
    name = name.replace(/\s+/g, ' ');
    return name.trim();
};

async function syncFromSrcAssets() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        if (!fs.existsSync(ASSETS_STORES_DIR)) {
            console.error(`Source directory not found: ${ASSETS_STORES_DIR}`);
            process.exit(1);
        }

        const files = fs.readdirSync(ASSETS_STORES_DIR);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

        const vendors = await db.collection('users').find({ role: 'vendor' }).toArray();

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (!imageExtensions.includes(ext)) continue;

            const cleanFileName = normalize(formatName(file));
            const srcPath = `/src/assets/stores profils/${file}`;
            
            // Find vendor with normalized matching
            const vendor = vendors.find(v => {
                const shopName = normalize(v.shopName);
                const name = normalize(v.name);
                return shopName === cleanFileName || name === cleanFileName || 
                       shopName.includes(cleanFileName) || cleanFileName.includes(shopName);
            });

            if (vendor) {
                await db.collection('users').updateOne(
                    { _id: vendor._id },
                    { $set: { image: srcPath } }
                );
                console.log(`✅ Updated Vendor: ${vendor.shopName || vendor.name} -> ${srcPath}`);
            } else {
                console.log(`❌ Could not find vendor for file: ${file} (Clean Name: ${cleanFileName})`);
            }
        }

        console.log('Refined Sync complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

syncFromSrcAssets();
