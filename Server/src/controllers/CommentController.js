const Comment = require("../models/Comment");

// Phương thức thêm comment
exports.createComment = async (req, res) => {
  try {
    const { userId, articleId, description } = req.body;
    const newComment = new Comment({ userId, articleId, description });
    await newComment.save();
    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Phương thức xóa comment
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Phương thức sửa thông tin comment
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const updates = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(commentId, updates, {
      new: true,
    });
    res
      .status(200)
      .json({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
