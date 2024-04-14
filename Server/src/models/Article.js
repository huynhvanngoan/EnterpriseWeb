const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Địa chỉ URL của hình ảnh
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // Trạng thái mặc định là "draft"
  },
  file: {
    type: String, // Địa chỉ URL của file nếu có
  },
  submitDate: {
    type: Date,
    default: Date.now, // Ngày nộp bài, mặc định là ngày hiện tại
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Tham chiếu đến model User, giả sử bạn đã tạo model User
    required: true,
  },
  academicyearId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Academic", // Tham chiếu đến model Magazine, giả sử bạn đã tạo model Magazine
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false, // Mặc định là false
  },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
