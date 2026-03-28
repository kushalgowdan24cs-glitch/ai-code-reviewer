const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendOTP, verifyOTP } = require("./otpService");

const requestOTP = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No account found with this email.");
  await sendOTP(email);
  return true;
};

const resetPassword = async (email, otp, newPassword) => {
  const valid = verifyOTP(email, otp);
  if (!valid) throw new Error("Invalid or expired OTP.");
  if (newPassword.length < 6) throw new Error("Password must be at least 6 characters.");
  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email }, { password: hashed });
  return true;
};

module.exports = { requestOTP, resetPassword };