
import { Router } from 'express';
import Lead from '../models/Leadmodel.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import Customer from '../models/Customermodel.js';

const router = Router();

router.get('/leads-by-status', authMiddleware, async (req, res) => {
  try {
    const customerIds = await Customer.find({ ownerId: req.user._id }).select('_id');
    const group = await Lead.aggregate([
    { $match: { customerId: { $in: customerIds.map(c => c._id) } } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$value' } } }
    ]);
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/leads-by-status/:customerId', authMiddleware, async (req, res) => {
  try {
    const { customerId } = req.params;

    
    const customer = await Customer.findOne({ _id: customerId, ownerId: req.user._id });
    if (!customer) {
      return res.status(403).json({ message: 'Not authorized to view this customer' });
    }

    const group = await Lead.aggregate([
      { $match: { customerId: customer._id } }, 
      { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$value' } } }
    ]);

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
