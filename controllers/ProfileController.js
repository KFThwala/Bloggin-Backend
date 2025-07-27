import User from "../models/User.js";
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // Comes from authMiddleware
    console.log(user)
    if(!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);

  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name if provided
    if (fullName) user.fullName = fullName;

    // If user wants to remove avatar
    if (avatar === "") {
      user.avatar = "";
    }

    // If avatar is a new URL
    else if (avatar && typeof avatar === "string" && !req.file) {
      user.avatar = avatar;
    }

    // If avatar is uploaded file via multer + cloudinary
    if (req.file?.cloudinaryUrl) {
      user.avatar = req.file.cloudinaryUrl;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;

 

    const user = await User.findById(userId);


    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile by ID error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
