const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

const { sendOTPHandler, resetPasswordHandler } = require("../controllers/passwordController");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", sendOTPHandler);      // ← ADD
router.post("/reset-password", resetPasswordHandler); // ← ADD

module.exports = router;