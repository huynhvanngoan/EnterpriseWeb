const express = require("express");
const UploadController = require("../controllers/UploadController");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Hàm để tạo tên tệp mới không có khoảng trắng và ký tự đặc biệt
const generateFileName = () => {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${randomString}`;
};
// Cấu hình Multer để lưu file vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const newFileName = generateFileName() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

// Khởi tạo multer với cấu hình lưu trữ đã được định nghĩa
const upload = multer({ storage: storage });

// Định nghĩa route upload file
router.post("/upload", upload.single("file"), UploadController.uploadFile);

module.exports = router;
