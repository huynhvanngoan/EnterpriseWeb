const express = require("express");
const commentController = require("../controllers/CommentController");
const router = express.Router();

// Route thêm comment
router.post("/create", commentController.createComment);

// Route xóa comment
router.delete("/:id", commentController.deleteComment);

// Route sửa thông tin comment
router.put("/:id", commentController.updateComment);

module.exports = router;
