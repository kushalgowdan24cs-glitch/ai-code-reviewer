const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const analyzeRoute = require("./routes/analyze");
const historyRoute = require("./routes/history");
const authRoute = require("./routes/auth");           // ← ADD

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/analyze", analyzeRoute);
app.use("/history", historyRoute);
app.use("/auth", authRoute);                          // ← ADD

app.get("/", (req, res) => {
  res.json({ status: "AI Code Reviewer API running ✅" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});