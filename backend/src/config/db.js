import mongoose from "mongoose";

export default async function connectDB(uri) {
  if (!uri) {
    console.warn("MONGODB_URI not provided - skipping DB connection (use .env)");
    return;
  }
  try {
    await mongoose.connect(uri, {});
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
