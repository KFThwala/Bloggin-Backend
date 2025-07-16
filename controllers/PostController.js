import Post from "../models/Post.js";

import Comment from "../models/Comment.js"; // ✅ Required


// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, excerpt, content, categories } = req.body;
    if (!title || !excerpt || !content || !categories) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const author = req.user._id; // from protect middleware

    // Use the Cloudinary URL set by uploadToCloudinary middleware
    const image = req.file ? req.file.cloudinaryUrl : null;

    const post = new Post({
      title,
      excerpt,
      content,
      image,
      categories,
      author,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all posts (with optional pagination)
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "fullName email") // populate author info
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single post by id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "fullName email")
      .populate({
        path: "comments",
        populate: { path: "author", select: "fullName" },
      });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update post by id
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, excerpt, content, image, categories } = req.body;

    post.title = title || post.title;
    post.excerpt = excerpt || post.excerpt;
    post.content = content || post.content;
    post.image = image || post.image;
    post.categories = categories || post.categories;

    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete post by id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne(); 

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get recent posts - top 10 most recent


export const getRecentPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("author", "fullName avatar"); // include avatar if you want to show user image

    res.json(posts);
  } catch (error) {
    console.error("Error in getRecentPosts:", error); // log to server console
    res.status(500).json({ error: error.message });
  }
};


// Get suggested posts based on user's favorite categories
export const getSuggestedPosts = async (req, res) => {
  try {
    const userCategories = req.user?.categories || [];

    let posts;

    if (userCategories.length > 0) {
  posts = await Post.find({ categories: { $in: userCategories } })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("author", "fullName avatar");
} else {
  const randomPosts = await Post.aggregate([{ $sample: { size: 5 } }]);
  const postIds = randomPosts.map((p) => p._id);
  posts = await Post.find({ _id: { $in: postIds } }).populate("author", "fullName avatar");
}


    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get trending posts based on number of likes
export const getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ likes: -1 }) // more likes = higher rank
      .limit(10)
      .populate("author", "fullName avatar");

    const postsWithLikeCount = posts.map(post => ({
      ...post.toObject(),
      likesCount: post.likes.length,
    }));

    res.json(postsWithLikeCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// controllers/postController.js
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


