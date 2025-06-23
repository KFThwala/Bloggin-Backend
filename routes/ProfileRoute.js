import express from "express";
import { getProfile, updateProfile, deleteAccount } from "../controllers/ProfileController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile-edit", protect, updateProfile);
router.delete("/delete", protect, deleteAccount);

export default router;
