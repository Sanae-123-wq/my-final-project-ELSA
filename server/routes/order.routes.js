import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendNotification } from '../socket.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Notification messages per status ────────────────────────────────────────
const CLIENT_MESSAGES = {
  preparing: '👨‍🍳 Your order is being prepared with love!',
  ready:     '🎉 Your order is ready! The delivery team will pick it up soon.',
  picked:    '🚚 Your order is on its way! Sit tight.',
  delivered: '📦 Your order has been delivered. Enjoy your treats!',
};

const VENDOR_MESSAGES = {
  picked:    '🛵 Your product is being delivered to the customer.',
  delivered: '✅ Your product was delivered successfully!',
};

const DELIVERY_MESSAGES = {
  ready: '🚚 New order ready for pickup! Check your assignments.',
};

// ─── Helper: notify a single user ────────────────────────────────────────────
const createAndSendNotification = async (userId, orderId, message, type) => {
  try {
    const notification = new Notification({ userId, orderId, message, type });
    await notification.save();
    sendNotification(userId.toString(), {
      _id: notification._id,
      message: notification.message,
      type: notification.type,
      orderId: notification.orderId,
      isRead: false,
      createdAt: notification.createdAt,
    });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

// GET all orders (Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('products.productId', 'name price')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET current user orders (Client)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.productId', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET orders for vendor
router.get('/vendor-orders', protect, async (req, res) => {
  try {
    const vendorProducts = await Product.find({ vendorId: req.user._id });
    const productIds = vendorProducts.map(p => p._id);

    const orders = await Order.find({
      'products.productId': { $in: productIds }
    })
      .populate('products.productId', 'name price vendorId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.productId', 'name price image');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create order
router.post('/', protect, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const userId = req.user._id;

    if (!products || products.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Missing order details.' });
    }

    const order = new Order({ userId, products, totalAmount });
    const saved = await order.save();

    res.status(201).json({
      message: 'Order Placed Successfully!',
      orderId: saved._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update order status with full multi-user notification fan-out
router.put('/:id', async (req, res) => {
  try {
    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) return res.status(404).json({ message: 'Order not found' });

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('products.productId', 'vendorId name');

    const newStatus = req.body.status;
    if (!newStatus || newStatus === oldOrder.status) {
      return res.json(updated);
    }

    const orderId = updated._id;

    // 1. Notify CLIENT
    if (CLIENT_MESSAGES[newStatus]) {
      await createAndSendNotification(
        updated.userId,
        orderId,
        CLIENT_MESSAGES[newStatus],
        newStatus
      );
    }

    // 2. Notify VENDOR(S) — find unique vendors from order products
    if (VENDOR_MESSAGES[newStatus]) {
      const vendorIds = [
        ...new Set(
          updated.products
            .map(p => p.productId?.vendorId?.toString())
            .filter(Boolean)
        ),
      ];

      for (const vendorId of vendorIds) {
        await createAndSendNotification(
          vendorId,
          orderId,
          VENDOR_MESSAGES[newStatus],
          newStatus
        );
      }
    }

    // 3. Notify ALL DELIVERY WORKERS when order is ready for pickup
    if (DELIVERY_MESSAGES[newStatus]) {
      const deliveryWorkers = await User.find({ role: 'delivery' }).select('_id');
      for (const worker of deliveryWorkers) {
        await createAndSendNotification(
          worker._id,
          orderId,
          DELIVERY_MESSAGES[newStatus],
          newStatus
        );
      }
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
