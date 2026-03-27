const { register, login } = require("../services/authService");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  try {
    const result = await register(name, email, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };