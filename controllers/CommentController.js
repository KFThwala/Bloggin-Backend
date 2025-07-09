// controllers/commentController.js
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// Create a comment on a post
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const userId = req.user._id;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      post: postId,
      author: userId,
      content,
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await comment.populate("author", "fullName avatar");

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/commentController.js
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only the author or admin can delete
    if (comment.author.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove comment reference from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

  // Reply to a comment
export const replyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params; // The parent comment ID
    const userId = req.user._id;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) return res.status(404).json({ message: "Parent comment not found" });

    // Create reply as a new comment
    const reply = await Comment.create({
      post: parentComment.post,
      author: userId,
      content,
    });

    // Push reply to parent
    parentComment.replies.push(reply._id);
    await parentComment.save();

    const populatedReply = await reply.populate("author", "fullName avatar");

    res.status(201).json(populatedReply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like or unlike a comment
export const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const liked = comment.likes.includes(userId);

    if (liked) {
      // Unlike
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      liked: !liked,
      likesCount: comment.likes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "fullName avatar")
      .populate({
        path: "replies",
        select: "content author createdAt likes",
        populate: {
          path: "author",
          select: "fullName avatar"
        },
        options: { sort: { createdAt: -1 } }
      });

    const enrichedComments = comments.map(comment => ({
      ...comment.toObject(),
      likesCount: comment.likes.length,
      replies: comment.replies.map(reply => ({
        ...reply.toObject(),
        likesCount: reply.likes.length
      }))
    }));

    res.json(enrichedComments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
