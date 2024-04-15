const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    const userFind = await User.findOne({ email: user.email });
    console.log(userFind);
    if (!userFind) {
      await user.save();
      const token = await user.generateAuthToken();
      return res.status(200).json({ user, token });
    }
    return res.status(400).json({ error: "User already exists" });
  } catch (error) {
    return res.status(400).json({ error: "An error has occurred" });
  }
};
exports.login = async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Unregistered account!", status: false });
    }
    // const validatePassword = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );
    const validatePassword = true;
    if (!validatePassword) {
      res.status(400).json({ message: "Wrong password!", status: false });
    }
    if (user && validatePassword) {
      const token = await user.generateAuthToken();
      // res.header("Authorization", token);
      res.status(200).json({ user, token, status: true });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.getProfile = async (req, res) => {
  res.json(req.user);
};
exports.logout = async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.logoutAll = async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getAllUsers = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find().skip(skip).limit(limit);
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getUserByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role: role });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting user" });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching user" });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "User updated successfully", data: updateUser });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating user" });
  }
};
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ data: totalUsers });
  } catch (error) {
    console.error("Error getting total number of users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
