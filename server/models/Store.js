import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String },
  openingHours: { type: String },
  image: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);
export default Store;
