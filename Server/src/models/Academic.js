const mongoose = require("mongoose");

const academicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  closureDate: {
    type: Date,
    required: true,
  },
  finalClosureDate: {
    type: Date,
    required: true,
  },
});

const Academic = mongoose.model("Academic", academicSchema);

module.exports = Academic;
