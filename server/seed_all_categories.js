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

const categoriesConfig = [
    { name: 'Cheesecakes', folder: 'cheese cakes' },
    { name: 'Chocolates', folder: 'chocolates' },
    { name: 'Cookies/Brownies', folder: 'cookies br' },
    { name: 'Cupcakes', folder: 'cupcakes' },
    { name: 'Donuts', folder: 'donuts' },
    { name: 'Macarons', folder: 'macarrons' },
    { name: 'Moroccan Sweets', folder: 'moroccan sweets' },
    { name: 'Tarts', folder: 'tartellettes' },
    { name: 'Tiramisu', folder: 'tiramisu sin' },
    { name: 'Viennoiseries', folder: 'viennoiseries' }
];

const capitalizeWords = (str) => {
    return str
        .split(/[-\s_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getRandomFloat = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const seedAllCategories = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully!');

        const stores = await Store.find({});
        if (!stores || stores.length === 0) {
            console.error('No stores found in database. Please seed stores first.');
            process.exit(1);
        }

        console.log(`Found ${stores.length} existing store(s).`);

        let totalInserted = 0;

        for (const category of categoriesConfig) {
            const imagesDir = path.join(__dirname, '../client/src/assets', category.folder);
            
            if (!fs.existsSync(imagesDir)) {
                console.warn(`Directory not found: ${imagesDir}. Skipping...`);
                continue;
            }

            const files = fs.readdirSync(imagesDir);
            const products = [];

            for (const file of files) {
                if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
                    const ext = path.extname(file);
                    const basename = path.basename(file, ext);
                    const name = capitalizeWords(basename);
                    const randomStore = stores[Math.floor(Math.random() * stores.length)];
                    
                    products.push({
                        name: name,
                        description: `Delicious and freshly prepared ${name} from our ${category.name} collection. Handcrafted with love and the finest ingredients for an exquisite taste.`,
                        image: `/src/assets/${category.folder}/${file}`,
                        images: [`/src/assets/${category.folder}/${file}`],
                        category: category.name,
                        price: getRandomFloat(5, 45), // Adjusted generic price range
                        storeId: randomStore._id,
                        vendorId: 'vendor_id_auto_gen',
                        stock: Math.floor(Math.random() * 20) + 5,
                        isNew: Math.random() > 0.7,
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
                console.log(`Inserting ${products.length} products for category "${category.name}"...`);
                await Product.collection.insertMany(products);
                totalInserted += products.length;
            } else {
                console.log(`No valid images found in folder: ${category.folder}`);
            }
        }

        console.log(`\nSuccessfully added ${totalInserted} new products across all categories!`);
    } catch (error) {
        console.error('Error seeding categories:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

seedAllCategories();
