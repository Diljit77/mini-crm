import { Schema, model } from "mongoose";

const leadSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["New", "Contacted", "Converted", "Lost"], default: "New" },
  value: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Lead = model("Lead", leadSchema);
export default Lead;
