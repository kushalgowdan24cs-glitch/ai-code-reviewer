const express = require("express");
const router = express.Router();
const { getHistory, getReview } = require("../controllers/historyController");

router.get("/", getHistory);
router.get("/:id", getReview);

module.exports = router;