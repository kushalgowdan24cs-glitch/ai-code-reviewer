// analyzeController.js — Only handles HTTP request/response
const { analyzeCode } = require("../services/analyzeService");

const analyze = async (req, res) => {
  const { code, language } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({ error: "No code provided." });
  }

  try {
    const result = await analyzeCode(code, language);
    res.json(result);
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ error: "AI analysis failed. Please try again." });
  }
};

module.exports = { analyze };