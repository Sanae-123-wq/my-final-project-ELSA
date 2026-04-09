import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

await mongoose.connect(process.env.MONGO_URI);
const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

const samples = await Product.find({ image: /^\/src\/assets\// }).select('image category').lean();
const patterns = new Set(samples.map(p => {
    const parts = p.image?.split('/');
    return parts?.slice(0, 4).join('/');
}));
console.log('ALL Image path prefixes:');
[...patterns].sort().forEach(p => console.log(' ', p));
console.log('\nTotal products with /src/assets/ paths:', samples.length);
await mongoose.connection.close();
