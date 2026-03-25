const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const analyzeCode = async (req, res) => {
  const { code, language } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({ error: "No code provided." });
  }

  try {
    const response = await client.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content: `You are an expert code reviewer. Always respond ONLY with a valid JSON object — no explanation, no markdown, no code fences. Use this exact structure:
{
  "issues": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "improved_code": "full improved code here as a string"
}`
        },
        {
          role: "user",
          content: `Review this ${language} code:\n\n${code}`
        }
      ],
      max_tokens: 1500,
    });

    const text = response.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json(parsed);

  } catch (err) {
    console.error("OpenRouter API error:", err.message);
    res.status(500).json({ error: "AI analysis failed. Check your API key or try again." });
  }
};

module.exports = { analyzeCode };