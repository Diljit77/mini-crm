import { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    company: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Customer = model("Customer", customerSchema);
export default Customer;
