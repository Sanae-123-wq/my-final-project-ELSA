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

// GET current user assigned deliveries (Delivery worker)
router.get('/my-deliveries', protect, async (req, res) => {
  try {
    const userRole = req.user.role?.toLowerCase() || '';
    if (userRole !== 'delivery') return res.status(403).json({ message: 'Not authorized' });
    const orders = await Order.find({ deliveryId: req.user._id })
      .populate('userId', 'name phone address')
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

// GET available orders (Ready for pickup but unassigned)
router.get('/available', protect, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'ready', deliveryId: null })
      .populate('userId', 'name phone address')
      .populate('products.productId', 'name price image')
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
router.put('/:id', protect, async (req, res) => {
  try {
    const oldOrder = await Order.findById(req.params.id).populate('products.productId');
    if (!oldOrder) return res.status(404).json({ message: 'Order not found' });

    const newStatus = req.body.status;
    const userRole = req.user.role?.toLowerCase() || '';

    console.log(`\n[ORDER UPDATE] User ${req.user.email} (Role: ${userRole}) attempting to update Order ${req.params.id} to status: ${newStatus}`);

    // RBAC Authorization Enforcement
    if (userRole === 'vendor' || userRole === 'patissier') {
      const ownsProducts = oldOrder.products.some(p => {
         if (!p.productId) return false;
         // Handle populated vendor object or raw string/ObjectId
         const vId = p.productId.vendorId?._id || p.productId.vendorId;
         return vId && vId.toString() === req.user._id.toString();
      });
      console.log(`[RBAC Vendor Check] ownsProducts: ${ownsProducts}. Order ID: ${req.params.id}`);
      
      if (!ownsProducts) {
          console.warn(`[RBAC Failed] Vendor ${req.user.email} attempted to update order they don't own.`);
          return res.status(403).json({ message: 'Not authorized to update this order' });
      }
      // Vendors should only progress up to 'ready'
      if (['picked', 'delivered'].includes(newStatus)) {
         console.warn(`[RBAC Failed] Vendor attempted to mark as ${newStatus}. Forbidden.`);
         return res.status(403).json({ message: 'Vendors cannot mark orders as picked or delivered' });
      }
    } else if (userRole === 'delivery') {
      if (!oldOrder.deliveryId || oldOrder.deliveryId.toString() !== req.user._id.toString()) {
        console.warn(`[RBAC Failed] Delivery user ${req.user.email} not assigned to this order.`);
        return res.status(403).json({ message: 'Not assigned to this delivery' });
      }
      if (newStatus !== 'picked' && newStatus !== 'delivered') {
        console.warn(`[RBAC Failed] Delivery attempted to mark as ${newStatus}. Forbidden.`);
        return res.status(403).json({ message: 'Delivery can only mark as picked or delivered' });
      }
    } else if (userRole === 'admin') {
      console.warn(`[RBAC Failed] Admin ${req.user.email} attempted to update order status. Forbidden by policy.`);
      return res.status(403).json({ message: 'Admins are not allowed to update order statuses. This must be handled by the vendor or delivery staff.' });
    }

    let updates = { ...req.body };

    // [MODIFIED] Auto-assignment removed here to support manual "Accept Order" flow.

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('products.productId', 'vendorId name');

    if (!newStatus || newStatus === oldOrder.status) {
      return res.json(updated);
    }

    const orderId = updated._id;

    // 1. Notify CLIENT
    if (CLIENT_MESSAGES[newStatus]) {
      console.log(`[NOTIFY] Emitting '${newStatus}' update to Client (ID: ${updated.userId})`);
      await createAndSendNotification(
        updated.userId,
        orderId,
        CLIENT_MESSAGES[newStatus],
        newStatus
      );
    }

    // 2. Notify VENDOR(S)
    if (VENDOR_MESSAGES[newStatus]) {
      const vendorIds = [
        ...new Set(
          updated.products
            .map(p => {
               const vId = p.productId?.vendorId?._id || p.productId?.vendorId;
               return vId ? vId.toString() : null;
            })
            .filter(Boolean)
        ),
      ];

      for (const vendorId of vendorIds) {
        console.log(`[NOTIFY] Emitting '${newStatus}' update to Vendor (ID: ${vendorId})`);
        await createAndSendNotification(
          vendorId,
          orderId,
          VENDOR_MESSAGES[newStatus],
          newStatus
        );
      }
    }

    // 3. Notify ASSIGNED DELIVERY WORKER when order is ready for pickup
    if (newStatus === 'ready' && DELIVERY_MESSAGES[newStatus] && updated.deliveryId) {
        console.log(`[NOTIFY] Emitting 'ready' pickup alert to Delivery Worker (ID: ${updated.deliveryId})`);
        await createAndSendNotification(
          updated.deliveryId,
          orderId,
          DELIVERY_MESSAGES[newStatus],
          newStatus
        );
        // Dispatch direct socket event to refresh Delivery dashboard in real-time
        sendNotification(updated.deliveryId.toString(), { 
            type: 'assigned', 
            orderId: updated._id, 
            message: 'Refresh Dashboard' 
        });
    }

    console.log(`[ORDER UPDATE SUCCESS] Order successfully updated to ${updated.status}.`);
    res.json(updated);
  } catch (err) {
    console.error('Order Update Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// PATCH accept order (Delivery worker claims an available order)
router.patch('/:id/accept', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        const userRole = req.user.role?.toLowerCase() || '';
        if (userRole !== 'delivery') {
            return res.status(403).json({ message: 'Only delivery workers can accept orders' });
        }

        if (order.deliveryId) {
            return res.status(400).json({ message: 'Order has already been assigned or accepted' });
        }

        if (order.status !== 'ready') {
            return res.status(400).json({ message: 'Order is not ready for pickup' });
        }

        order.deliveryId = req.user._id;
        await order.save();

        // Notify client and vendor if needed (optional here since status didn't change, but good for real-time)
        res.json({ message: 'Order accepted successfully', order });
    } catch (err) {
        res.status(500).json({ message: err.message });
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
