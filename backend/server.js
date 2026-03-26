const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const analyzeRoute = require("./routes/analyze");
const historyRoute = require("./routes/history");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/analyze", analyzeRoute);
app.use("/history", historyRoute);

app.get("/", (req, res) => {
  res.json({ status: "AI Code Reviewer API running ✅" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});