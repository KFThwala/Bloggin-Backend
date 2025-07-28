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
  getMyPosts,
  getPosts,
  getPostsByUserId
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

router.get("/all", protect, getPosts);

router.get("/getMy", protect, getMyPosts);

// GET /api/posts/recent
router.get("/recent", getRecentPosts);

// GET /api/posts/suggested (requires auth)
router.get("/suggested", protect, getSuggestedPosts);

// GET /api/posts/trending
router.get("/trending", protect,getTrendingPosts);

router.get("/user/:id", getPostsByUserId); 

router.post("/:postId/like", protect, toggleLikePost);

// GET /api/posts/:id
router.get("/:id", getPostById);

// PUT /api/posts/:id
router.put("/:id", 
   upload.single("image"), // middleware to read the file
  uploadToCloudinary("posts"), // middleware to upload to Cloudinary
  protect, updatePost);

// DELETE /api/posts/:id
router.delete("/:id", protect, deletePost);

export default router;
