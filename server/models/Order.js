import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
      status: {
        type: String,
        enum: ['pending', 'preparing', 'ready'],
        default: 'pending'
      }
    },
  ],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 20 },
  paymentMethod: { type: String, enum: ['card', 'cod'], default: 'cod' },
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'picked', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
