import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

async function fixVendorImages() {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;

        const vendors = await db.collection('users').find({ role: 'vendor' }).toArray();
        console.log(`Found ${vendors.length} vendors.`);

        for (const vendor of vendors) {
            console.log(`- Vendor: ${vendor.shopName || vendor.name} | Image: ${vendor.image || 'NONE'}`);

            // If the vendor is "Paul" or similar and has no image, give it one
            if (!vendor.image || vendor.image === '') {
                let logoUrl = '';
                const shopName = (vendor.shopName || '').toLowerCase();

                if (shopName.includes('paul')) {
                    logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_Paul.svg/1200px-Logo_Paul.svg.png';
                } else if (shopName.includes('mega') || shopName.includes('pain')) {
                    logoUrl = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200';
                } else {
                    logoUrl = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=200';
                }

                if (logoUrl) {
                    await db.collection('users').updateOne(
                        { _id: vendor._id },
                        { $set: { image: logoUrl } }
                    );
                    console.log(`  Updated ${vendor.shopName || vendor.name} with logo: ${logoUrl}`);
                }
            }
        }

        console.log('Finished fixing vendor images.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixVendorImages();
