import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";

// Routes
import AuthRoutes from "./routes/AuthRoute.js";
import ProfileRoutes from "./routes/ProfileRoute.js";
import postRoutes from "./routes/PostRoute.js";
import commentRoutes from "./routes/CommentRoute.js";

// Initialize app
const app = express();

// Load environment variables
config();

// Connect to MongoDB
connectDB();
// Middleware: CORS
app.use(cors({
  origin: ["https://blogging-one-eta.vercel.app", "http://localhost:5174", "http://localhost:5173"],
  credentials: true,
}));
// Middleware: JSON parser
app.use(express.json());

// Middleware: Helmet with CSP


// API Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/user", ProfileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("💥 Internal Server Error:", err.stack);
  res.status(500).json({ message: err.message || "Something broke!" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});