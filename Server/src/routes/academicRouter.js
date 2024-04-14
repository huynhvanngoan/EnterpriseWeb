const express = require("express");
const academicController = require("../controllers/AcademicController");
const router = express.Router();

router.get("/all", academicController.getAllAcademic);
router.get("/:id", academicController.getAcademicById);
router.get("/static/total", academicController.getTotalAcademics);
// Route thêm kỳ học
router.post("/create", academicController.createAcademic);

// Route xóa kỳ học
router.delete("/:id", academicController.deleteAcademic);

// Route sửa thông tin kỳ học
router.put("/:id", academicController.updateAcademic);

module.exports = router;
