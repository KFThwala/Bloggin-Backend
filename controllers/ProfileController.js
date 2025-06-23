import User from "../models/User.js";
export const getProfile = async (req, res) => {
  try {
    const user = req.user; // Comes from authMiddleware
    console.log(user)
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

    if (fullName) user.fullName = fullName;
    if (avatar === "") {
      user.avatar = ""; // remove avatar
    } else if (avatar) {
      user.avatar = avatar; // update avatar
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
