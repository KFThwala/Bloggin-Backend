import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getFeaturedPosts,
  getRecentPosts,
  getSuggestedPosts,
} from "../controllers/PostController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/featured", getFeaturedPosts);
router.get("/recent", getRecentPosts);
router.get("/suggested", protect, getSuggestedPosts);

// This must come after the above to avoid conflicts
router.get("/:id", getPostById);

// Protected routes
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
