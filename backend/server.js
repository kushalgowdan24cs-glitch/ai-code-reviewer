const express = require("express");
const cors = require("cors");
require("dotenv").config();

const analyzeRoute = require("./routes/analyze");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Routes =====
app.use("/analyze", analyzeRoute);

// ===== Health Check =====
app.get("/", (req, res) => {
  res.json({ status: "AI Code Reviewer API is running ✅" });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});