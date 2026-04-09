import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const redistributeProducts = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully!');

        // Fetch valid vendor users
        const vendors = await User.find({ role: 'vendor', status: 'approved' });
        if (!vendors || vendors.length === 0) {
            console.error('No vendor users found in database.');
            process.exit(1);
        }

        console.log(`Found ${vendors.length} existing valid vendor(s).`);

        const allProducts = await Product.find({});
        if (!allProducts || allProducts.length === 0) {
            console.warn('No products found to redistribute.');
            process.exit(0);
        }

        console.log(`Found ${allProducts.length} total product(s). Redistributing...`);

        // Group products by category
        const productsByCategory = {};
        for (const product of allProducts) {
            const cat = product.category || 'Uncategorized';
            if (!productsByCategory[cat]) {
                productsByCategory[cat] = [];
            }
            productsByCategory[cat].push(product);
        }

        const bulkOperations = [];

        for (const [category, products] of Object.entries(productsByCategory)) {
            // Shuffle vendors per category so we don't always hand Vendor 1 the first product
            const shuffledVendors = shuffleArray(vendors);
            
            // Shuffle products so they aren't ordered alphabetically or by insertion time
            const shuffledProducts = shuffleArray(products);
            
            console.log(`- Redistributing ${shuffledProducts.length} products for category "${category}"`);

            shuffledProducts.forEach((product, idx) => {
                const targetVendor = shuffledVendors[idx % shuffledVendors.length];
                
                bulkOperations.push({
                    updateOne: {
                        filter: { _id: product._id },
                        // Now we set vendorId specifically, allowing the route to populate
                        update: { $set: { vendorId: targetVendor._id.toString(), storeId: targetVendor._id } }
                    }
                });
            });
        }

        if (bulkOperations.length > 0) {
            const result = await Product.bulkWrite(bulkOperations);
            console.log(`\nSuccessfully redistributed products! Modified ${result.modifiedCount} documents.`);
        }

    } catch (error) {
        console.error('Error redistributing products:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

redistributeProducts();
