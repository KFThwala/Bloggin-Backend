// middlewares/upload.js
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Memory storage (no files written to disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // ✅ 4MB limit
});

// Cloudinary uploader middleware
export const uploadToCloudinary = (folder) => async (req, res, next) => {
  
  if (!req.file) return next(); // No file uploaded

  const streamUpload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

  try {
    const result = await streamUpload();
    req.file.cloudinaryUrl = result.secure_url;
    req.file.public_id = result.public_id;
    next();
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Failed to upload image to Cloudinary" });
  }
};

export default upload;
