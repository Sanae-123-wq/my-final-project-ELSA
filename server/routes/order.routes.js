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
  ready: '🎉 Your order is ready! The delivery team will pick it up soon.',
  picked: '🚚 Your order is on its way! Sit tight.',
  delivered: '📦 Your order has been delivered. Enjoy your treats!',
  cancelled: '❌ Your order has been cancelled.',
};

const VENDOR_MESSAGES = {
  picked: '🛵 Your product is being delivered to the customer.',
  delivered: '✅ Your product was delivered successfully!',
  cancelled: '❌ An order containing your product was cancelled.',
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
      .populate('userId', 'name email phone address')
      .sort({ createdAt: -1 });

    const vendorId = req.user._id.toString();
    const vendorOrders = [];

    for (const order of orders) {
      const myProducts = order.products.filter(p => {
        const vId = p.productId?.vendorId?._id || p.productId?.vendorId;
        return vId && vId.toString() === vendorId;
      });

      if (myProducts.length > 0) {
        const myTotal = myProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        
        let myStatus = 'pending';
        // if order is already completely picked/delivered/cancelled, inherit that main status.
        if (['picked', 'delivered', 'cancelled'].includes(order.status)) {
          myStatus = order.status;
        } else if (myProducts.every(p => p.status === 'ready')) {
          myStatus = 'ready';
        } else if (myProducts.some(p => p.status === 'preparing')) {
          myStatus = 'preparing';
        }

        vendorOrders.push({
          ...order.toObject(),
          products: myProducts,
          totalAmount: myTotal,
          status: myStatus
        });
      }
    }

    res.json(vendorOrders);
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

    // Auto-assign to delivery named "mimi"
    const mimi = await User.findOne({ role: 'delivery', name: { $regex: /^mimi$/i } });
    const deliveryId = mimi ? mimi._id : null;

    const order = new Order({
      userId,
      products,
      totalAmount,
      deliveryFee: 20,
      deliveryId
    });
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

    let updated;
    let mainStatusChanged = false;
    let finalStatus = oldOrder.status;

    // RBAC Authorization Enforcement
    if (userRole === 'vendor' || userRole === 'patissier') {
      const vendorId = req.user._id.toString();
      let isOwningProducts = false;

      // Update status for this vendor's products
      oldOrder.products.forEach(p => {
        const vId = p.productId?.vendorId?._id || p.productId?.vendorId;
        if (vId && vId.toString() === vendorId) {
          isOwningProducts = true;
          if (['pending', 'preparing', 'ready'].includes(newStatus)) {
             p.status = newStatus;
          }
        }
      });

      if (!isOwningProducts) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }

      // Compute overarching main order status
      const allReady = oldOrder.products.every(p => p.status === 'ready');
      const anyPreparing = oldOrder.products.some(p => p.status === 'preparing');

      let mainStatus = oldOrder.status;
      if (allReady) {
         mainStatus = 'ready';
      } else if (anyPreparing || newStatus === 'preparing') {
         mainStatus = 'preparing';
      }
      
      mainStatusChanged = mainStatus !== oldOrder.status;
      finalStatus = mainStatus;
      oldOrder.status = mainStatus;
      oldOrder.markModified('products');
      await oldOrder.save();
      updated = await Order.findById(req.params.id).populate('products.productId', 'vendorId name');

    } else {
      if (userRole === 'delivery') {
        if (!oldOrder.deliveryId || oldOrder.deliveryId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not assigned to this delivery' });
        if (newStatus !== 'picked' && newStatus !== 'delivered') return res.status(403).json({ message: 'Delivery can only mark as picked or delivered' });
      } else if (userRole === 'admin') {
        return res.status(403).json({ message: 'Admins cannot update order statuses.' });
      } else if (userRole === 'client') {
        if (oldOrder.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
        if (newStatus !== 'cancelled') return res.status(403).json({ message: 'Clients can only cancel' });
        if (oldOrder.status !== 'pending') return res.status(400).json({ message: 'Can only cancel pending orders' });
      }

      mainStatusChanged = newStatus !== oldOrder.status;
      finalStatus = newStatus;
      const updates = { ...req.body };
      updated = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate('products.productId', 'vendorId name');
    }

    if (!newStatus || !mainStatusChanged) {
      return res.json(updated);
    }

    const orderId = updated._id;

    // 1. Notify CLIENT
    if (CLIENT_MESSAGES[finalStatus]) {
      console.log(`[NOTIFY] Emitting '${finalStatus}' update to Client (ID: ${updated.userId})`);
      await createAndSendNotification(
        updated.userId,
        orderId,
        CLIENT_MESSAGES[finalStatus],
        finalStatus
      );
    }

    // 2. Notify VENDOR(S)
    if (VENDOR_MESSAGES[finalStatus]) {
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
        console.log(`[NOTIFY] Emitting '${finalStatus}' update to Vendor (ID: ${vendorId})`);
        await createAndSendNotification(
          vendorId,
          orderId,
          VENDOR_MESSAGES[finalStatus],
          finalStatus
        );
      }
    }

    // 3. Notify ASSIGNED DELIVERY WORKER when order is ready for pickup
    if (finalStatus === 'ready' && DELIVERY_MESSAGES[finalStatus] && updated.deliveryId) {
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
