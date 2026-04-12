import express from 'express';
import Reclamation from '../models/Reclamation.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { sendNotification } from '../socket.js';

const router = express.Router();

// POST submit a reclamation
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, message } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Validation: Only allowed for picked or delivered
    if (!['picked', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        message: 'Reclamations are only allowed for orders that are picked up or delivered.'
      });
    }

    const reclamation = new Reclamation({
      userId: req.user._id,
      orderId,
      message
    });

    await reclamation.save();

    // Notify all Admins
    const admins = await User.find({ role: 'admin' });
    for (const adminUser of admins) {
      const adminNotif = new Notification({
        userId: adminUser._id,
        message: `New reclamation from ${req.user.name}: "${message.substring(0, 50)}..."`,
        type: 'reclamation_submitted',
        relatedId: reclamation._id
      });
      await adminNotif.save();
      sendNotification(adminUser._id.toString(), adminNotif);
    }

    res.status(201).json({ message: 'Reclamation submitted successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A reclamation has already been submitted for this order.' });
    }
    res.status(400).json({ message: err.message });
  }
});

// GET all reclamations (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const reclamations = await Reclamation.find()
      .populate('userId', 'name email')
      .populate('orderId')
      .sort({ createdAt: -1 });
    res.json(reclamations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH reply to reclamation (Admin only)
router.patch('/:id/reply', protect, admin, async (req, res) => {
  try {
    const { adminReply } = req.body;
    console.log(`[Reclamation Reply] RecID: ${req.params.id}, Reply length: ${adminReply?.length}`);

    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) return res.status(404).json({ message: 'Reclamation not found' });

    reclamation.adminReply = adminReply;
    reclamation.status = 'answered';
    await reclamation.save();

    // Notify user (Safely)
    if (reclamation.userId) {
      const notification = new Notification({
        userId: reclamation.userId,
        message: `Admin has replied to your reclamation: "${adminReply.substring(0, 50)}..."`,
        type: 'reclamation_answered',
        relatedId: reclamation._id
      });
      await notification.save();
      sendNotification(reclamation.userId.toString(), notification);
    }

    res.json({ message: 'Reply sent and user notified.', reclamation });
  } catch (err) {
    console.error(`[Reclamation Reply Error]: ${err.message}`);
    res.status(400).json({ message: err.message });
  }
});

export default router;
