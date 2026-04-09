import mongoose from 'mongoose';

const reclamationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  message: { type: String, required: true },
  adminReply: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'answered', 'resolved'], 
    default: 'pending' 
  },
}, { timestamps: true });

// Prevent duplicate reclamations for same order
reclamationSchema.index({ userId: 1, orderId: 1 }, { unique: true });

const Reclamation = mongoose.model('Reclamation', reclamationSchema);
export default Reclamation;
