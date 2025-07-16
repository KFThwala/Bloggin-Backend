import express from "express";
import {
  createPost,
  // getPosts,
  getPostById,
  updatePost,
  deletePost,
  // getFeaturedPosts,
  getRecentPosts,
  getSuggestedPosts,
  getTrendingPosts,
  toggleLikePost,
  getMyPosts
} from "../controllers/PostController.js";

import upload, { uploadToCloudinary } from "../middleware/Upload.js";
import { protect } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// POST /api/posts - Create new post with image upload
router.post(
  "/create",
  protect,
  upload.single("image"),
  uploadToCloudinary("posts"), // optional Cloudinary folder name
  createPost
);

router.get("/getMy", protect, getMyPosts);
// GET /api/posts
// router.get("/", getPosts);

// GET /api/posts/featured
// router.get("/featured", getFeaturedPosts);

// GET /api/posts/recent
router.get("/recent", getRecentPosts);

// GET /api/posts/suggested (requires auth)
router.get("/suggested", protect, getSuggestedPosts);

// GET /api/posts/trending
router.get("/trending", protect,getTrendingPosts);

router.post("/:postId/like", protect, toggleLikePost);

// GET /api/posts/:id
router.get("/:id", getPostById);

// PUT /api/posts/:id
router.put("/:id", protect, updatePost);

// DELETE /api/posts/:id
router.delete("/:id", protect, deletePost);

export default router;
