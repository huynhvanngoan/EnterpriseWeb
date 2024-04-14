const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const fileRouter = require("./src/routes/fileRouter");
const authRouter = require("./src/routes/authRouter");
const articleRouter = require("./src/routes/articlesRouter");
const facultyRouter = require("./src/routes/facultyRouter");
const academicRouter = require("./src/routes/academicRouter");
const commentRouter = require("./src/routes/commentRouter");
const accessRouter = require("./src/routes/accesslogRouter");
// Sử dụng middleware để parse JSON request body
app.use(express.json());
//public
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
// Gọi router
app.use(cors());
app.use("/api/file", fileRouter);
app.use("/api/auth", authRouter);
app.use("/api/article", articleRouter);
app.use("/api/faculty", facultyRouter);
app.use("/api/academic", academicRouter);
app.use("/api/comment", commentRouter);
app.use("/api/log", accessRouter);

// Cổng mặc định là 3000
const PORT = process.env.PORT || 8080;
const MongoDBUri = "mongodb+srv://ngoanhvgcc200153:USXqOZbAF8XjAayq@development.ztamuma.mongodb.net/?retryWrites=true&w=majority&appName=development";
app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
  // Kết nối MongoDB
  await mongoose
    .connect(MongoDBUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
});
