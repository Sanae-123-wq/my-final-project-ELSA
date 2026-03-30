import mongoose from 'mongoose';

const reclamationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'resolved'], 
    default: 'pending' 
  },
}, { timestamps: true });

// Prevent duplicate reclamations for same order
reclamationSchema.index({ userId: 1, orderId: 1 }, { unique: true });

const Reclamation = mongoose.model('Reclamation', reclamationSchema);
export default Reclamation;
