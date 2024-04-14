const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_KEY = "KhangVNQ";
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  role: {
    type: String,
    enum: ["student", "admin", "marketing", "department", "guest"], // Thêm các role mà user có thể có
    default: "student", // Role mặc định khi tạo user mới
  },
  academicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Academic", // Tham chiếu đến model Academic
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty", // Tham chiếu đến model Faculty
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
