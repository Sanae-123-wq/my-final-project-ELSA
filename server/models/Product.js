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
  category: { 
    type: String, 
    required: true,
    enum: ['Cake', 'Pastry', 'Bread', 'Traditional', 'Cookies', 'Chocolate', 'Healthy', 'Pack']
  },
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  vendorId: { type: String },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },

  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
