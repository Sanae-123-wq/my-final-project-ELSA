require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const productSchema = new mongoose.Schema({
      name: String,
      vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }, { strict: false });

    const Product = mongoose.model('Product', productSchema);

    const prodsCount = await Product.countDocuments();
    const prodsWithVendor = await Product.find({ vendorId: { $exists: true, $ne: null } });
    const vendorIds = [...new Set(prodsWithVendor.map(p => p.vendorId?.toString()))];

    console.log(`Total Products: ${prodsCount}`);
    console.log(`Products with vendorId: ${prodsWithVendor.length}`);
    console.log(`Unique Vendor IDs found:`, vendorIds);

    // Let's also check the latest user
    const userSchema = new mongoose.Schema({ name: String, role: String }, { strict: false });
    const User = mongoose.model('User', userSchema);
    const latestVendor = await User.findOne({ role: 'vendor' }).sort({ _id: -1 });
    
    if (latestVendor) {
      console.log(`Latest Vendor User ID: ${latestVendor._id}`);
      console.log(`Latest Vendor Name: ${latestVendor.name}`);
    } else {
      console.log('No vendor found in DB');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
