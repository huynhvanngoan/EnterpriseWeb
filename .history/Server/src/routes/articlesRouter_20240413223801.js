const express = require("express");
const articlesController = require("../controllers/ArticleController");
const multer = require("multer");
const router = express.Router();

// Cấu hình Multer để lưu file vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Khởi tạo multer với cấu hình lưu trữ đã được định nghĩa
const upload = multer({ storage: storage });

// Route thêm bài viết với hình ảnh và file đính kèm
router.get("/:userId", articlesController.getByUserId);
router.get("/public/all", articlesController.getAllIsPublic);
router.get("/get/all", articlesController.getAll);
router.get("/getbyfaculty/:facultyId", articlesController.getByFacultyId);
router.get("/getapproved/all", articlesController.getAllIsApproved);
router.post("/create", articlesController.createArticle);
router.get("/getbyid/:id", articlesController.getById);
router.get(
  "/static/totalbyfaculty",
  articlesController.getTotalArticlesByFaculty
);
router.get(
  "/static/totalbyacademic/:facultyId",
  articlesController.getTotalArticlesByAcademicYear
);
router.get(
  "/static/totalyacademic",
  articlesController.getTotalArticlesWithAcademicYear
)
router.get(
  "/static/totalbystatus/:facultyId",
  articlesController.getTotalArticlesByStatusAndFaculty
);
router.get(
  "/static/totalbyprivate/:facultyId",
  articlesController.getTotalArticlesByPrivateAndFaculty
);
router.get(
  "/static/totalbycomment/:facultyId",
  articlesController.getContributionWithAndWithoutComments
);
//downloadn route
router.get("/downloadbyid/:id", articlesController.downLoadById);
router.get("/download/all", articlesController.downLoadAll);
// Route xóa bài viết
router.delete("/:id", articlesController.deleteArticle);

// Route sửa bài viết
router.put("/:id", articlesController.updateArticle);

module.exports = router;
