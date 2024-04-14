const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  marketingCoordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Tham chiếu đến model User
  },
});

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
