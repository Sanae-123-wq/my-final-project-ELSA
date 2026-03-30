import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

async function checkOrphans() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        const products = await db.collection('products').find().toArray();
        const dbImages = products.map(p => p.image).filter(img => img && img.startsWith('/uploads/products/'));
        const dbFilenames = dbImages.map(img => img.split('/').pop());

        const uploadDir = 'uploads/products';
        const files = fs.readdirSync(uploadDir);

        console.log(`Files in folder: ${files.length}`);
        console.log(`Images in DB: ${dbFilenames.length}`);

        const orphans = files.filter(f => !dbFilenames.includes(f));
        if (orphans.length > 0) {
            console.log('--- ORPHANED FILES (No DB record) ---');
            orphans.forEach(f => {
                const stats = fs.statSync(path.join(uploadDir, f));
                console.log(`- ${f} | Created: ${stats.birthtime}`);
            });
        } else {
            console.log('No orphaned files found.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOrphans();
