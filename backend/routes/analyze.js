const express = require("express");
const router = express.Router();
const { analyze } = require("../controllers/analyzecontrollers");

router.post("/", analyze);

module.exports = router;