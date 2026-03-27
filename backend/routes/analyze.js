const express = require("express");
const router = express.Router();
const { analyze } = require("../controllers/analyzecontrollers");
const { protect } = require("../middleware/authMiddleware");

// Protected — must be logged in to analyze
router.post("/", protect, analyze);

module.exports = router;