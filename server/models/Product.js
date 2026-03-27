import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_fr: { type: String },
  name_ar: { type: String },
  description: { type: String },
  description_fr: { type: String },
  description_ar: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  vendorId: { type: String },

  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
