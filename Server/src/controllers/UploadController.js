const File = require("../models/File");

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Error uploading file" });
    }

    const newFile = new File({
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    });

    await newFile.save();
    return res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
