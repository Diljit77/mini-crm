
import Customer from '../models/Customermodel.js';
import Lead from '../models/Leadmodel.js';
import { customerSchema } from '../validation/Schema.js';



export async function createCustomer(req, res) {
const { error } = customerSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });


try {
const data = { ...req.body, ownerId: req.user._id };
const customer = new Customer(data);
await customer.save();
res.json(customer);
} catch (err) {
// eslint-disable-next-line no-console
console.error(err);
res.status(500).json({ message: 'Server error' });
}
}


export async function listCustomers(req, res) {
const page =req.query.page ?? 1;
const limit = req.query.limit ?? 10;
const q =req.query.q ?? '';
const filter = { ownerId: req.user._id };
if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }];


try {
const total = await Customer.countDocuments(filter);
const customers = await Customer.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
res.json({ total, page, limit, customers });
} catch (err) {
// eslint-disable-next-line no-console
console.error(err);
res.status(500).json({ message: 'Server error' });
}
}


export async function getCustomer(req, res) {
try {
const customer = await Customer.findById(req.params.id);
if (!customer) return res.status(404).json({ message: 'Not found' });
if (String(customer.ownerId) !== String(req.user._id) && req.user.role !== 'admin')
return res.status(403).json({ message: 'Forbidden' });
const leads = await Lead.find({ customerId: customer._id });
res.json({ customer, leads });
} catch (err) {
// eslint-disable-next-line no-console
console.error(err);
res.status(500).json({ message: 'Server error' });
}
}


export async function updateCustomer(req, res) {
const { error } = customerSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });
try {
const customer = await Customer.findById(req.params.id);
if (!customer) return res.status(404).json({ message: 'Not found' });
if (String(customer.ownerId) !== String(req.user._id) && req.user.role !== 'admin')
return res.status(403).json({ message: 'Forbidden' });
Object.assign(customer, req.body);
await customer.save();
res.json(customer);
} catch (err) {

console.error(err);
res.status(500).json({ message: 'Server error' });
}
}


export async function deleteCustomer(req, res) {
try {
const customer = await Customer.findById(req.params.id);
if (!customer) return res.status(404).json({ message: 'Not found' });
if (String(customer.ownerId) !== String(req.user._id) && req.user.role !== 'admin')
return res.status(403).json({ message: 'Forbidden' });
await Lead.deleteMany({ customerId: customer._id });
await customer.deleteOne();
res.json({ message: 'Deleted' });
} catch (err) {

console.error(err);
res.status(500).json({ message: 'Server error' });
}
}