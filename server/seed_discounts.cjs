require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/elsa-patisserie';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const productSchema = new mongoose.Schema({
      name: String,
      discount: { type: Number, default: 0 }
    }, { strict: false });

    const Product = mongoose.model('Product', productSchema);

    // Apply some test discounts
    const result1 = await Product.updateMany({ name: /Croissant/i }, { $set: { discount: 15 } });
    const result2 = await Product.updateMany({ name: /Cake/i }, { $set: { discount: 10 } });
    const result3 = await Product.updateMany({ name: /Cookie/i }, { $set: { discount: 20 } });
    const result4 = await Product.updateMany({ name: /Tarte/i }, { $set: { discount: 5 } });

    console.log(`Updated Croissants: ${result1.modifiedCount}`);
    console.log(`Updated Cakes: ${result2.modifiedCount}`);
    console.log(`Updated Cookies: ${result3.modifiedCount}`);
    console.log(`Updated Tartes: ${result4.modifiedCount}`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
