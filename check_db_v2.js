const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from server directory
dotenv.config({ path: path.join(__dirname, 'server/.env') });

async function checkDB() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const productCount = await mongoose.connection.db.collection('products').countDocuments();
    const orderCount = await mongoose.connection.db.collection('orders').countDocuments();
    const userCount = await mongoose.connection.db.collection('users').countDocuments();

    console.log(`Summary: ${productCount} products, ${orderCount} orders, ${userCount} users`);

    if (productCount > 0) {
      const sampleProduct = await mongoose.connection.db.collection('products').findOne({});
      console.log('Sample Product:', JSON.stringify(sampleProduct, null, 2));
    }

    if (orderCount > 0) {
      const sampleOrder = await mongoose.connection.db.collection('orders').findOne({});
      console.log('Sample Order:', JSON.stringify(sampleOrder, null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

checkDB();
