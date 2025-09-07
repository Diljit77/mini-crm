import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authroutes.js";
import customerRoutes from "./routes/customerroutes.js";
import leadRoutes from "./routes/leadroutes.js";
import reportRoutes from "./routes/reportroutes.js";

import connectDB from "./config/db.js";

export function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  connectDB(process.env.MONGODB_URI);

  app.use("/api/auth", authRoutes);
  app.use("/api/customers", customerRoutes);
  app.use("/api/leads", leadRoutes);
  app.use("/api/report", reportRoutes);

  app.get("/", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV || "development" }));

  return app;
}
