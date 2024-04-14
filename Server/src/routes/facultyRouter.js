const express = require("express");
const facultyController = require("../controllers/FacultiesController");
const router = express.Router();

router.get("/all", facultyController.getAllFaculties);
router.get("/:id", facultyController.getFacultyById);
router.get("/static/total", facultyController.getTotalFaculties);

// Route thêm khoa
router.post("/create", facultyController.createFaculty);

// Route xóa khoa
router.delete("/:id", facultyController.deleteFaculty);

// Route sửa thông tin khoa
router.put("/:id", facultyController.updateFaculty);

module.exports = router;
