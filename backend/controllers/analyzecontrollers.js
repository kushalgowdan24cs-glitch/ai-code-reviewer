// analyzeController.js
// Currently returns MOCK data.
// We will replace this with real AI API call in Day 4.

const analyzeCode = async (req, res) => {
  const { code, language } = req.body;

  // Basic validation
  if (!code || code.trim() === "") {
    return res.status(400).json({ error: "No code provided." });
  }

  // ===== MOCK RESPONSE (for testing frontend ↔ backend connection) =====
  // TODO: Replace with real Gemini/OpenAI API call in Step 4
  const mockResponse = {
    issues: [
      "Variable 'x' is declared with 'var' — prefer 'let' or 'const'",
      "Missing semicolons at end of statements",
      "Function has no return value or error handling",
    ],
    suggestions: [
      "Use 'const' for variables that don't change",
      "Add JSDoc comments to document your function",
      "Consider adding input validation",
    ],
    improved_code: `// Improved version\nfunction example() {\n  const x = 10;\n  console.log(x);\n}`,
  };

  // Simulate slight delay (like a real API call)
  setTimeout(() => {
    res.json(mockResponse);
  }, 800);
};

module.exports = { analyzeCode };