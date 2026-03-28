const { requestOTP, resetPassword } = require("../services/passwordService");

const sendOTPHandler = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });
  try {
    await requestOTP(email);
    res.json({ message: "OTP sent to your email." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const resetPasswordHandler = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ error: "All fields required." });
  try {
    await resetPassword(email, otp, newPassword);
    res.json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { sendOTPHandler, resetPasswordHandler };