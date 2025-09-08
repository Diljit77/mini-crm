
import Lead from '../models/Leadmodel.js';
import Customer from '../models/Customermodel.js';
import { leadSchema } from '../validation/Schema.js';



async function ensureCustomerOwnership(req) {
const customer = await Customer.findById(req.params.customerId);
if (!customer) return null;
if (String(customer.ownerId) !== String(req.user._id) && req.user.role !== 'admin') return null;
return customer;
}


export async function createLead(req, res) {
const { error } = leadSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });
try {
const customer = await ensureCustomerOwnership(req);
if (!customer) return res.status(404).json({ message: 'Customer not found or forbidden' });
const lead = new Lead({ ...req.body, customerId: customer._id });
await lead.save();
res.json(lead);
} catch (err) {

console.error(err);
res.status(500).json({ message: 'Server error' });
}
}


export async function listLeads(req, res) {
try {
const customer = await ensureCustomerOwnership(req);
if (!customer) return res.status(404).json({ message: 'Customer not found or forbidden' });
const leads = await Lead.find({ customerId: customer._id }).sort({ createdAt: -1 });
res.json(leads);
} catch (err) {

console.error(err);
res.status(500).json({ message: 'Server error' });
}
}


export async function updateLead(req,res) {

try {
const customer = await ensureCustomerOwnership(req);
if (!customer) return res.status(404).json({ message: 'Customer not found or forbidden' });
const lead = await Lead.findById(req.params.leadId);
if (!lead) return res.status(404).json({ message: 'Lead not found' });
Object.assign(lead, req.body);
await lead.save();
res.json(lead);
} catch (err) {

console.log(err);
res.status(500).json({ message: 'Server error' });
}
}


export async function deleteLead(req, res) {
try {
const customer = await ensureCustomerOwnership(req);
if (!customer) return res.status(404).json({ message: 'Customer not found or forbidden' });
const lead = await Lead.findById(req.params.leadId);
if (!lead) return res.status(404).json({ message: 'Lead not found' });
await lead.deleteOne();
res.json({ message: 'Deleted' });
} catch (err) {

console.error(err);
res.status(500).json({ message: 'Server error' });
}
}