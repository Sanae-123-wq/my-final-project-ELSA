import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const OrderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  products: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    price: Number
  }],
  status: String,
  totalAmount: Number
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  vendorId: String,
  price: Number
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
const Product = mongoose.model('Product', ProductSchema);

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    products.forEach(p => {
      console.log(`Product: ${p.name}, ID: ${p._id}, VendorID: ${p.vendorId}`);
    });

    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders`);
    
    for (const order of orders) {
      console.log(`Order ID: ${order._id}, Status: ${order.status}`);
      for (const item of order.products) {
        const prod = await Product.findById(item.productId);
        console.log(`  - Item Product ID: ${item.productId}, VendorID: ${prod ? prod.vendorId : 'NOT FOUND'}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
