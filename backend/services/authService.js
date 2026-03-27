const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (name, email, password) => {
  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered.");

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Save user
  const user = await User.create({ name, email, password: hashed });

  // Generate token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user: { id: user._id, name: user.name, email: user.email } };
};

const login = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password.");

  // Check password
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password.");

  // Generate token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user: { id: user._id, name: user.name, email: user.email } };
};

module.exports = { register, login };