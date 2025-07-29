import express from "express";
import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import AuthRoutes from "./routes/AuthRoute.js"
import ProfileRoutes from "./routes/ProfileRoute.js"
import postRoutes from "./routes/PostRoute.js"
import commentRoutes from "./routes/CommentRoute.js"


const app = express();

// Load environment variables
config();

// Middleware
app.use(cors());
app.use(express.json());

import helmet from "helmet";

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://bloggin-backend-c4l0.onrender.com"],
      scriptSrc: ["'self'"], // optional
      styleSrc: ["'self'", "'unsafe-inline'"], // optional
    },
  })
);


// Connect to MongoDB
connectDB();

app.use("/api/auth", AuthRoutes);
app.use("/api/user", ProfileRoutes)
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes)

// Start server
const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});


app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
