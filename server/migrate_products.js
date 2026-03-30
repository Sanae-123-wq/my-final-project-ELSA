import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const ProductSchema = new mongoose.Schema({
  vendorId: String,
  storeId: String
}, { strict: false });

const Product = mongoose.model('Product', ProductSchema);

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    const vendorId = '69c94b90c1818341825ed03e'; // sanaechef
    
    console.log('Updating products without vendorId...');
    const result = await Product.updateMany(
      { $or: [{ vendorId: { $exists: false } }, { vendorId: null }, { vendorId: '' }] },
      { $set: { vendorId: vendorId } }
    );
    
    console.log(`✅ Migration complete! ${result.modifiedCount} products linked to vendor sanaechef.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
