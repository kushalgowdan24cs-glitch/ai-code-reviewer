const express = require("express");
const router = express.Router();
const { analyzeCode } = require("../controllers/analyzecontrollers");

// POST /analyze
router.post("/", analyzeCode);

module.exports = router;