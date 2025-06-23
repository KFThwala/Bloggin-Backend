import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import AuthRoutes from "./routes/AuthRouter.js"
import ProfileRoutes from "./routes/ProfileRoute.js"

const app = express();

// Load environment variables
config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use("/api/auth", AuthRoutes);
app.use("/api/user", ProfileRoutes)

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
