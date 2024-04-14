const AccessLog = require("../models/AccessLog");

// Phương thức thêm kỳ học
exports.pustLog = async (req, res) => {
  try {
    const { url, browser } = req.body;
    const newAccessLog = new AccessLog({ url, browser });
    await newAccessLog.save();
    res.status(201).json({
      message: "AccessLog push successfully",
      AccessLog: newAccessLog,
    });
  } catch (error) {
    console.error("Error creating academic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

 
exports.getAccessLogStatsWithUrl = async (req, res) => {
  try {
    // Nhóm các bản ghi theo URL không có dấu # và đếm số lần xuất hiện
    const urlStats = await AccessLog.aggregate([
      {
        $match: {
          url: { $not: /#/ },  
        },
      },
      {
        $group: {
          _id: "$url",  
          count: { $sum: 1 },  
        },
      },
      {
        $sort: { count: -1 }, 
      },
    ]);

    const formattedUrlStats = urlStats.map((item) => ({
      name: item._id,
      count: item.count,
    }));
    res.status(200).json({ data: formattedUrlStats });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê truy cập:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

exports.getAccessLogStatsWithBrowser = async (req, res) => {
  try {
    // Group by URL and browser, then count occurrences for each combination
    const urlStats = await AccessLog.aggregate([
      {
        $group: {
          _id: "$browser", // Group by both URL and browser
          count: { $sum: 1 }, // Count occurrences for each combination
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order (most accessed URLs first)
      },
    ]);

    // Format the data with separate fields for URL, browser, and count
    const formattedUrlStats = urlStats.map((item) => ({
      name: item._id,
      count: item.count,
    }));

    res.status(200).json({
      message: "Lấy thống kê truy cập thành công",
      data: formattedUrlStats,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê truy cập:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
