const express = require("express");
const accessController = require("../controllers/AcceslogController");
const router = express.Router();

// Route thêm kỳ học
router.post("/push", accessController.pustLog);
router.get("/statiswithurl", accessController.getAccessLogStatsWithUrl);
router.get("/statiswithbrower", accessController.getAccessLogStatsWithBrowser);

module.exports = router;
