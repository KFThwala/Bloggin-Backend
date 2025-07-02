import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    image: String,
    excerpt: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    categories: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    isFeatured: { type: Boolean, default: false }, // ⭐️ for featured posts
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);