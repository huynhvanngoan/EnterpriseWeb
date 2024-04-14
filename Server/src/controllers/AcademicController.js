const Academic = require("../models/Academic");

// Phương thức thêm kỳ học
exports.createAcademic = async (req, res) => {
  try {
    const { name, closureDate, finalClosureDate } = req.body;
    const newAcademic = new Academic({ name, closureDate, finalClosureDate });
    await newAcademic.save();
    res.status(201).json({
      message: "Academic created successfully",
      academic: newAcademic,
    });
  } catch (error) {
    console.error("Error creating academic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Phương thức xóa kỳ học
exports.deleteAcademic = async (req, res) => {
  try {
    const academicId = req.params.id;
    await Academic.findByIdAndDelete(academicId);
    res.status(200).json({ message: "Academic deleted successfully" });
  } catch (error) {
    console.error("Error deleting academic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Phương thức sửa thông tin kỳ học
exports.updateAcademic = async (req, res) => {
  try {
    const academicId = req.params.id;
    const updates = req.body;
    const updatedAcademic = await Academic.findByIdAndUpdate(
      academicId,
      updates,
      { new: true }
    );
    res.status(200).json({
      message: "Academic updated successfully",
      academic: updatedAcademic,
    });
  } catch (error) {
    console.error("Error updating academic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllAcademic = async (req, res) => {
  try {
    const academic = await Academic.find();
    res.status(200).json({ data: academic });
  } catch (error) {
    console.error("Error fetching all faculties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Phương thức lấy thông tin kỳ học dựa trên ID
exports.getAcademicById = async (req, res) => {
  try {
    const academicId = req.params.id;
    const academic = await Academic.findById(academicId);
    if (!academic) {
      return res.status(404).json({ message: "Academic not found" });
    }
    res.status(200).json({ data: academic });
  } catch (error) {
    console.error("Error fetching academic by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getTotalAcademics = async (req, res) => {
  try {
    const totalAcademics = await Academic.countDocuments();
    res.status(200).json({ data: totalAcademics });
  } catch (error) {
    console.error("Error getting total number of academic terms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
