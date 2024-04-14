const Article = require("../models/Article");
const Comment = require("../models/Comment");
const Faculty = require("../models/Faculty");
const Academic = require("../models/Academic");
const User = require("../models/User");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// Cấu hình Multer để lưu file vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Khởi tạo multer với cấu hình lưu trữ đã được định nghĩa
const upload = multer({ storage: storage });
const tempFolderPath = path.join(__dirname, "..", "..", "temp");
const isAcademicYearExpired = async (academicYearId) => {
  try {
    const academicYear = await Academic.findById(academicYearId);
    if (!academicYear) {
      return false; // Invalid academic year ID, consider returning an error
    }
    const currentDate = new Date();
    return currentDate > academicYear.finalClosureDate; // Check against closureDate
  } catch (error) {
    console.error("Error checking academic year expiration:", error);
    return false; // Handle potential errors gracefully
  }
};
// Phương thức thêm bài viết
exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      status,
      userId,
      image,
      file,
      academicyearId,
      isPublic,
    } = req.body;
    // Check if academic year is expired
    const isExpired = await isAcademicYearExpired(academicyearId);
    if (!isExpired) {
      const newArticle = new Article({
        title,
        content,
        status,
        image,
        file,
        userId,
        academicyearId,
        isPublic,
      });

      await newArticle.save();
      const user = await User.findById(userId);
      const faculty = await Faculty.findById(user.facultyId);
      const marketingC = await User.findById(faculty.marketingCoordinator);
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: "587",
        auth: {
          user: "h5studiogl@gmail.com",
          pass: "fScdnZ4WmEDqjBA1",
        },
      });
      const title_mail = "Submission Notice";
      const content_mail = `
    <h1>Notification</h1>
    <p>Hello teacher, please inform that student ${marketingC.name} has passed the lesson</p>`;
      const mailOptions = {
        from: "coms@gmail.com",
        to: marketingC.email,
        subject: title_mail,
        text: content_mail,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        }
      });
      res
        .status(201)
        .json({ message: "Article created successfully", article: newArticle });
    }
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Phương thức xóa bài viết
exports.deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    await Article.findByIdAndDelete(articleId);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Phương thức sửa bài viết
exports.updateArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const updates = req.body;
    const article = await Article.findById(articleId);
    console.log(article);
    const isExpired = await isAcademicYearExpired(article.academicyearId);
    if (!isExpired) {
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        updates,
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "Article updated successfully",
        article: updatedArticle,
      });
    } else {
      res.status(400).json({
        message: "Article updated unsuccessfully",
      });
    }
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Lấy tất cả bài viết của một người dùng
exports.getByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const articles = await Article.find({ userId });
    const articlesWithComments = await Promise.all(
      articles.map(async (article) => {
        // Tìm các comment cho bài viết hiện tại của user có id là userId
        const comment = await Comment.findOne({
          articleId: article._id,
        });
        return {
          ...article.toObject(),
          comments: comment ? comment.description : "",
        };
      })
    );
    res.status(200).json({ data: articlesWithComments });
  } catch (error) {
    console.error("Error fetching articles by user ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Lấy tất cả bài viết công khai, bao gồm tên người dùng và gán vào thuộc tính author
exports.getAllIsPublic = async (req, res) => {
  try {
    const articles = await Article.find({ isPublic: true }).populate(
      "userId",
      "name"
    );
    const publicArticlesWithAuthors = articles.map((article) => {
      return {
        ...article.toObject(),
        author: article.userId.name,
      };
    });
    res.status(200).json({ data: publicArticlesWithAuthors });
  } catch (error) {
    console.error("Error fetching public articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const articles = await Article.find().populate("userId", "name");
    const articlesWithAuthors = articles.map((article) => {
      return {
        ...article.toObject(),
        author: article.userId.name,
      };
    });
    res.status(200).json({ data: articlesWithAuthors });
  } catch (error) {
    console.error("Error fetching public articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getByFacultyId = async (req, res) => {
  try {
    const { facultyId } = req.params;
    // Tìm tất cả người dùng thuộc khoa đó
    const users = await User.find({ facultyId });

    // Lấy danh sách id của các người dùng thuộc khoa
    const userIds = users.map((user) => user._id);

    // Tìm tất cả các bài viết của các người dùng thuộc khoa
    const articles = await Article.find({ userId: { $in: userIds } });

    const articlesWithAuthors = articles.map((article) => {
      return {
        ...article.toObject(),
        author: users.find(
          (user) => user._id.toString() === article.userId.toString()
        ).name,
      };
    });

    res.status(200).json({ data: articlesWithAuthors });
  } catch (error) {
    console.error("Error fetching articles by faculty ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllIsApproved = async (req, res) => {
  try {
    const articles = await Article.find({ status: "approved" }).populate(
      "userId",
      "name"
    );
    const publicArticlesWithAuthors = articles.map((article) => {
      return {
        ...article.toObject(),
        author: article.userId.name,
      };
    });
    res.status(200).json({ data: publicArticlesWithAuthors });
  } catch (error) {
    console.error("Error fetching public articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.downLoadById = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "File not found" });
    }
    const fileName = article.file;
    console.log(fileName);
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      article.file.replace(/\\/g, "/")
    );
    console.log(filePath);
    // Kiểm tra xem file có tồn tại không
    if (fs.existsSync(filePath)) {
      const originalFileName = path.basename(fileName);
      console.log(originalFileName);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${originalFileName}"`
      );
      res.download(filePath); // Trả về file cho client để tải
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.downLoadAll = async (req, res) => {
  try {
    const articles = await Article.find();

    // Kiểm tra xem có bài viết nào không
    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    const zipFileName = "all_files.zip";
    const zipFilePath = `./temp/${zipFileName}`;

    // Tạo một file zip mới
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip");

    output.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed."
      );
    });

    archive.on("error", (err) => {
      throw err;
    });

    // Thêm tất cả các file vào file zip
    articles.forEach((article) => {
      const fileName = article.file.substring(
        article.file.indexOf("\\uploads") + 9
      );
      console.log(fileName);
      const filePath = path.join(__dirname, "..", "..", "uploads", fileName);
      console.log(filePath);
      archive.file(filePath, { name: article._id.toString() }); // Sử dụng id của article làm tên file trong zip
    });

    // Finalize và tạo file zip
    archive.pipe(output);
    archive.finalize();

    // Trả về file zip cho client để tải
    res.download(zipFilePath, zipFileName, (err) => {
      if (err) {
        console.error("Error downloading zip file:", err);
        res.status(500).json({ message: "Internal server error" });
      }

      // Xóa file zip sau khi đã tải
      fs.unlinkSync(zipFilePath);
    });
  } catch (error) {
    console.error("Error downloading all files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId).populate(
      "userId",
      "name"
    );
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    const comments = await Comment.find({ articleId: article._id }).populate(
      "userId",
      "name"
    );
    const formattedComments = comments.map((comment) => ({
      userName: comment.userId.name,
      description: comment.description,
      date: comment.date,
    }));
    const articleData = article.toJSON();
    articleData.comments = formattedComments;
    res.status(200).json({ data: articleData });
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getTotalArticles = async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    res.status(200).json({ data: totalArticles });
  } catch (error) {
    console.error("Error getting total number of articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getTotalArticlesByFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find(); // Lấy danh sách tất cả các khoa
    const totalArticlesByFaculty = [];

    // Lặp qua từng khoa
    for (const faculty of faculties) {
      const users = await User.find({ facultyId: faculty._id }); // Tìm tất cả người dùng thuộc khoa hiện tại
      const userIds = users.map((user) => user._id); // Lấy danh sách id người dùng

      // Tìm tất cả bài viết của các người dùng thuộc khoa hiện tại
      const articles = await Article.find({ userId: { $in: userIds } });

      // Đếm số lượng bài viết
      const totalArticles = articles.length;

      // Lưu vào đối tượng kết quả với tên và số lượng bài viết của khoa
      totalArticlesByFaculty.push({ facultyName: faculty.name, totalArticles });
    }

    res.status(200).json({ data: totalArticlesByFaculty });
  } catch (error) {
    console.error("Error getting total number of articles by faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTotalArticlesWithAcademicYear = async (req, res) => {
    try {
        const articles = await Article.find();
        const articlesByAcademicYear = [];

        for (const article of articles) {
            const academicYearId = article.academicyearId.toString();
            const academicYearName = await getAcademicYearNameById(
                academicYearId
            );
            const index = articlesByAcademicYear.findIndex(
                (item) => item.name === academicYearName
            );
            if (index === -1) {
                articlesByAcademicYear.push({
                    name: academicYearName,
                    count: 1,
                });
            } else {
                articlesByAcademicYear[index].count++;
            }
        }
        res.status(200).json({ data: articlesByAcademicYear });
    } catch (error) {
        console.error(
            "Error getting total number of articles by academic year:",
            error
        );
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getTotalArticlesByAcademicYear = async (req, res) => {
    try {
        const { facultyId } = req.params;
       
            const users = await User.find({ facultyId });

            const userIds = users.map((user) => user._id);

            const articles = await Article.find({ userId: { $in: userIds } });

            const articlesByAcademicYear = [];

            for (const article of articles) {
                const academicYearId = article.academicyearId.toString();
                const academicYearName = await getAcademicYearNameById(
                    academicYearId
                );
                const index = articlesByAcademicYear.findIndex(
                    (item) => item.name === academicYearName
                );
                if (index === -1) {
                    articlesByAcademicYear.push({
                        name: academicYearName,
                        count: 1,
                    });
                } else {
                    articlesByAcademicYear[index].count++;
                }
            }
            res.status(200).json({ data: articlesByAcademicYear });
       
            res.status(200).json({ data: articlesByAcademicYear });
        }
    } catch (error) {
        console.error(
            "Error getting total number of articles by academic year:",
            error
        );
        res.status(500).json({ message: "Internal server error" });
    }
};

// Hàm để lấy tên của năm học dựa trên ID
const getAcademicYearNameById = async (academicYearId) => {
  try {
    // Tìm năm học trong cơ sở dữ liệu dựa trên ID
    const academicYear = await Academic.findById(academicYearId);
    if (academicYear) {
      return academicYear.name; // Trả về tên của năm học nếu tìm thấy
    } else {
      return "Unknown"; // Trả về "Unknown" nếu không tìm thấy năm học
    }
  } catch (error) {
    console.error("Error getting academic year name by ID:", error);
    return "Unknown"; // Trả về "Unknown" nếu có lỗi xảy ra
  }
};

exports.getTotalArticlesByStatus = async (req, res) => {
  try {
    // Lấy tất cả các bài viết từ cơ sở dữ liệu
    const articles = await Article.find();

    // Khởi tạo một đối tượng để lưu trữ số lượng bài viết cho từng trạng thái
    const articlesByStatus = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    // Lặp qua mỗi bài viết và thống kê theo trạng thái
    articles.forEach((article) => {
      switch (article.status) {
        case "pending":
          articlesByStatus.pending++;
          break;
        case "approved":
          articlesByStatus.approved++;
          break;
        case "rejected":
          articlesByStatus.rejected++;
          break;
        default:
          break;
      }
    });

    res.status(200).json({ data: articlesByStatus });
  } catch (error) {
    console.error("Error getting total number of articles by status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getTotalArticlesByStatusAndFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    // Tìm tất cả người dùng thuộc khoa đó
    const users = await User.find({ facultyId });

    // Lấy danh sách id của các người dùng thuộc khoa
    const userIds = users.map((user) => user._id);

    // Tìm tất cả các bài viết của các người dùng thuộc khoa
    const articles = await Article.find({ userId: { $in: userIds } });

    // Khởi tạo một đối tượng để lưu trữ số lượng bài viết theo trạng thái và theo khoa
    const articlesByStatusAndFaculty = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    // Lặp qua mỗi bài viết và thống kê theo trạng thái và theo khoa
    articles.forEach((article) => {
      switch (article.status) {
        case "pending":
          articlesByStatusAndFaculty.pending++;
          break;
        case "approved":
          articlesByStatusAndFaculty.approved++;
          break;
        case "rejected":
          articlesByStatusAndFaculty.rejected++;
          break;
        default:
          break;
      }
    });

    res.status(200).json({ data: articlesByStatusAndFaculty });
  } catch (error) {
    console.error(
      "Error getting total number of articles by status and faculty:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getTotalArticlesByPrivateAndFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    // Tìm tất cả người dùng thuộc khoa đó
    const users = await User.find({ facultyId });

    // Lấy danh sách id của các người dùng thuộc khoa
    const userIds = users.map((user) => user._id);

    // Tìm tất cả các bài viết của các người dùng thuộc khoa
    const articles = await Article.find({ userId: { $in: userIds } });

    // Khởi tạo một đối tượng để lưu trữ số lượng bài viết theo trạng thái và theo khoa
    const articlesByPrivateAndFaculty = {
      public: 0,
      private: 0,
    };

    // Lặp qua mỗi bài viết và thống kê theo trạng thái và theo khoa
    articles.forEach((article) => {
      if (article.isPublic) {
        articlesByPrivateAndFaculty.public++;
      } else {
        articlesByPrivateAndFaculty.private++;
      }
    });

    res.status(200).json({ data: articlesByPrivateAndFaculty });
  } catch (error) {
    console.error(
      "Error getting total number of articles by status and faculty:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getContributionWithAndWithoutComments = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const users = await User.find({ facultyId });

    const userIds = users.map((user) => user._id);

    const articles = await Article.find({ userId: { $in: userIds } });

    let withComments = 0;
    let withoutComments = 0;

    for (const article of articles) {
      const comment = await Comment.findOne({ articleId: article._id });
      if (comment) {
        withComments++;
      } else {
        withoutComments++;
      }
    }

    res.status(200).json({
      data: {
        withComments,
        withoutComments,
      },
    });
  } catch (error) {
    console.error(
      "Error getting contribution with and without comments:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
