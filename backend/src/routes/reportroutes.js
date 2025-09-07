import { Router } from 'express';
import Lead from '../models/Leadmodel.js';
import Customer from '../models/Customermodel.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = Router();

router.get('/leads-by-status', authMiddleware, async (req, res) => {
  try {

    const customerIds = await Customer.find({ ownerId: req.user._id }).select('_id');

    const group = await Lead.aggregate([
      { $match: { customerId: { $in: customerIds.map(c => c._id) } } }, // only leads for this user's customers
      { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$value' } } }
    ]);

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
