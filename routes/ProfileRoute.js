import express from "express";
import { getProfile, updateProfile, deleteAccount, getProfileById, } from "../controllers/ProfileController.js";
import { protect } from "../middleware/AuthMiddleware.js";
import upload, { uploadToCloudinary } from "../middleware/Upload.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put(
  "/profile-edit",
  protect,
  upload.single("avatar"), // middleware to read the file
  uploadToCloudinary("avatars"), // middleware to upload to Cloudinary
  updateProfile
);
router.delete("/delete", protect, deleteAccount);
router.get("/profile/:id", protect, getProfileById);


export default router;
