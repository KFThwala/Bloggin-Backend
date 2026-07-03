import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registration of the blogging user
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

     

    // Validate the data
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
if (!validEmail) {
  return res.status(400).json({ message: "Invalid email" });
}


    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Reg body", req.body);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password if is the same with the one you registered with
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    

    // Return safe user data
    const userWithoutPassword = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
