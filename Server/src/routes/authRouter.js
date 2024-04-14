const express = require("express");
const AuthController = require("../controllers/AuthController");
const router = express.Router();
const auth = require("../middleware/auth");

// router.get("/users", AuthController.getAll);
router.post("/create", auth, AuthController.createUser);
router.post("/login", AuthController.login);
router.get("/profile", auth, AuthController.getProfile);
router.post("/users/me/logout", auth, AuthController.logout);
router.post("/users/me/logoutall", auth, AuthController.logoutAll);
router.post("/users/search", auth, AuthController.getAllUsers);
router.get("/getUserByRole/:role", AuthController.getUserByRole);
router.get("/user/:id", AuthController.getUserById);
router.delete("/user/:id", AuthController.deleteUser);
router.put("/user/:id", AuthController.updateUser);
router.get("/static/total", AuthController.getTotalUsers);

module.exports = router;
