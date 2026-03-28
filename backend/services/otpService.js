const nodemailer = require("nodemailer");
require("dotenv").config();

// Store OTPs in memory (fine for MVP)
const otpStore = {};

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTP(email) {
  const otp = generateOTP();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore[email] = { otp, expiry };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"CodeSense AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your CodeSense AI Password Reset OTP",
    html: `
      <div style="font-family:Arial;max-width:400px;margin:auto;padding:30px;background:#13161e;color:#e2e8f0;border-radius:12px;">
        <h2 style="color:#00e5a0;">⬡ CodeSense AI</h2>
        <p>Your OTP for password reset:</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#00e5a0;margin:20px 0;">
          ${otp}
        </div>
        <p style="color:#6b7280;font-size:12px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });

  return true;
}

// Verify OTP
function verifyOTP(email, otp) {
  const record = otpStore[email];
  if (!record) return false;
  if (Date.now() > record.expiry) { delete otpStore[email]; return false; }
  if (record.otp !== otp) return false;
  delete otpStore[email];
  return true;
}

module.exports = { sendOTP, verifyOTP };