import express from "express";
import { createComment, deleteComment, getCommentsByPost, replyToComment, toggleLikeComment } from "../controllers/CommentController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/create/:postId", protect, createComment);
router.delete("/delete/:commentId", protect, deleteComment);
router.get("/:postId", protect, getCommentsByPost)
router.post("/reply/:commentId", protect, replyToComment);
router.post("/like/:commentId", protect, toggleLikeComment);

export default router;