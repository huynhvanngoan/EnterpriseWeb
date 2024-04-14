const Faculty = require("../models/Faculty");
const User = require("../models/User");

// Phương thức thêm khoa
exports.createFaculty = async (req, res) => {
  try {
    const { name, marketingCoordinator } = req.body;
    const newFaculty = new Faculty({ name, marketingCoordinator });
    await newFaculty.save();
    res
      .status(201)
      .json({ message: "Faculty created successfully", faculty: newFaculty });
  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Phương thức xóa khoa
exports.deleteFaculty = async (req, res) => {
  try {
    const facultyId = req.params.id;
    await Faculty.findByIdAndDelete(facultyId);
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Phương thức sửa thông tin khoa
exports.updateFaculty = async (req, res) => {
  try {
    const facultyId = req.params.id;
    const updates = req.body;
    const updatedFaculty = await Faculty.findByIdAndUpdate(facultyId, updates, {
      new: true,
    });
    res.status(200).json({
      message: "Faculty updated successfully",
      faculty: updatedFaculty,
    });
  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    const facultiesWithCoordinatorName = await Promise.all(
      faculties.map(async (faculty) => {
        const coordinator = await User.findById(faculty.marketingCoordinator);
        const coordinatorName = coordinator ? coordinator.name : "Unknown";
        return {
          _id: faculty._id,
          name: faculty.name,
          marketingCoordinatorName: coordinatorName,
        };
      })
    );
    res.status(200).json({ data: facultiesWithCoordinatorName });
  } catch (error) {
    console.error("Error fetching all faculties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Phương thức lấy thông tin khoa bởi ID
exports.getFacultyById = async (req, res) => {
  try {
    const facultyId = req.params.id;
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    const coordinator = await User.findById(faculty.marketingCoordinator);
    const coordinatorName = coordinator ? coordinator.name : "Unknown";
    const facultyWithCoordinatorName = {
      _id: faculty._id,
      name: faculty.name,
      marketingCoordinatorName: coordinatorName,
    };
    res.status(200).json({ data: facultyWithCoordinatorName });
  } catch (error) {
    console.error("Error fetching faculty by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getTotalFaculties = async (req, res) => {
  try {
    const totalFaculties = await Faculty.countDocuments();
    res.status(200).json({ data: totalFaculties });
  } catch (error) {
    console.error("Error getting total number of faculties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
