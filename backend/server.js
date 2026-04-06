const express = require("express");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const analyzeRoute = require("./routes/analyze");
const historyRoute = require("./routes/history");
const authRoute = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();

// Middleware
app.use(express.json());

// 🔥 Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/analyze", analyzeRoute);
app.use("/history", historyRoute);
app.use("/auth", authRoute);

// 🔥 Default route (IMPORTANT)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});