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

// Middleware
app.use(cors({
  origin: "https://blogging-six-sigma.vercel.app",
  credentials: true,
}));

app.use(express.json());

// Helmet with Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false, // Fully custom CSP
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Use only if necessary — better to use nonce in production
        "https://blogging-five-pi.vercel.app",
      ],
      scriptSrcElem: [
        "'self'",
        "'unsafe-inline'",
        "https://blogging-five-pi.vercel.app",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      imgSrc: [
        "'self'",
        "data:", // Allow base64 images
        "https://bloggin-backend-c4l0.onrender.com",
        "https://blogging-five-pi.vercel.app",
      ],
      connectSrc: [
        "'self'",
        "https://bloggin-backend-c4l0.onrender.com",
        "https://blogging-five-pi.vercel.app",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  })
);

// API Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/user", ProfileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("💥 Internal Server Error:", err.stack);
  res.status(500).json({ message: "Something broke!" });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
