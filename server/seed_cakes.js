import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Store from './models/Store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const imagesDir = path.join(__dirname, '../client/src/assets/cakes');

const capitalizeWords = (str) => {
    return str
        .split(/[-\s_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getRandomFloat = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const seedCakes = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully!');

        // Fetch existing stores
        const stores = await Store.find({});
        if (!stores || stores.length === 0) {
            console.error('No stores found in database. Please seed stores first.');
            process.exit(1);
        }

        console.log(`Found ${stores.length} existing store(s).`);

        // Read images from directory
        if (!fs.existsSync(imagesDir)) {
            console.error(`Directory not found: ${imagesDir}`);
            process.exit(1);
        }

        const files = fs.readdirSync(imagesDir);
        const products = [];

        for (const file of files) {
            // Check if it's an image
            if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
                // Parse name
                const ext = path.extname(file);
                const basename = path.basename(file, ext);
                const name = capitalizeWords(basename);

                // Additional mock product data
                const randomStore = stores[Math.floor(Math.random() * stores.length)];
                
                products.push({
                    name: name,
                    description: `Delicious and freshly prepared ${name} perfect for your special occasion. Handcrafted with love and the finest ingredients to ensure a memorable experience.`,
                    image: `/src/assets/cakes/${file}`,
                    images: [`/src/assets/cakes/${file}`], // Used by some UI components
                    category: 'Cakes',
                    price: getRandomFloat(15, 60),
                    storeId: randomStore._id,
                    vendorId: 'vendor_id_auto_gen',
                    stock: Math.floor(Math.random() * 20) + 5,
                    isNewProduct: Math.random() > 0.7,
                    isAvailable: true,
                    rating: getRandomFloat(4, 5),
                    numReviews: Math.floor(Math.random() * 50),
                    approvalStatus: 'approved',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        }

        if (products.length > 0) {
            console.log(`Found ${products.length} images. Inserting products...`);
            // Bypass Mongoose validation by using native insertMany to allow "Cakes"
            await Product.collection.insertMany(products);
            console.log(`Successfully added ${products.length} new cake products!`);
        } else {
            console.log('No valid image files found.');
        }

    } catch (error) {
        console.error('Error seeding cakes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

seedCakes();
