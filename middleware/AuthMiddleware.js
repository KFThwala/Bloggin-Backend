import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
