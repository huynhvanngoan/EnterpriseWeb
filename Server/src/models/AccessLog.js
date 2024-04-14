const mongoose = require("mongoose");

const AccessLogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  browser: {
    type: String,
    required: true,
  },
});

const AccessLog = mongoose.model("AccessLog", AccessLogSchema);

module.exports = AccessLog;
