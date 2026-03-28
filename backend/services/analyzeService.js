// analyzeService.js — All business logic lives here
const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const analyzeCode = async (code, language, userId = null) => {
  const prompt = `
You are an expert code reviewer and software engineer. Analyze the following ${language} code thoroughly and respond ONLY with a valid JSON object. No explanation, no markdown, no code fences.

Analyze ALL of the following aspects:
1. BUGS — Logic errors, wrong operators, incorrect conditions
2. INDENTATION & FORMATTING — Inconsistent spacing, wrong indentation, style issues  
3. EXCEPTION HANDLING — Missing try/catch, unhandled edge cases, null checks
4. SECURITY — SQL injection, XSS, unsafe inputs, exposed secrets
5. PERFORMANCE — Unnecessary loops, memory leaks, inefficient operations
6. NAMING CONVENTIONS — Poor variable/function names, inconsistent naming
7. CODE COMPLEXITY — Overly complex logic that can be simplified
8. UNUSED CODE — Dead code, unused variables, unnecessary imports
9. BEST PRACTICES — Language-specific conventions not followed

Return this exact JSON structure:
{
  "issues": [
    { "type": "Bug", "line": "line number or N/A", "message": "description" },
    { "type": "Formatting", "line": "line number or N/A", "message": "description" },
    { "type": "Exception Handling", "line": "line number or N/A", "message": "description" },
    { "type": "Security", "line": "line number or N/A", "message": "description" },
    { "type": "Performance", "line": "line number or N/A", "message": "description" },
    { "type": "Naming", "line": "line number or N/A", "message": "description" },
    { "type": "Complexity", "line": "line number or N/A", "message": "description" },
    { "type": "Unused Code", "line": "line number or N/A", "message": "description" },
    { "type": "Best Practice", "line": "line number or N/A", "message": "description" }
  ],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "improved_code": "full corrected and improved code as a string",
  "score": 72,
  "grade": "B+",
  "summary": "one line summary of overall code quality",
  "time_complexity": {
    "original": "O(n)",
    "improved": "O(1)",
    "original_label": "brief description of original complexity",
    "improved_label": "brief description of improved complexity",
    "explanation": "2-3 sentence explanation of why complexity changed"
  }
}
Only include issue types that actually exist in the code. If no issues of a type exist, skip it.
The score should be out of 100 based on overall quality.

Code to review:
\`\`\`${language}
${code}
\`\`\`
`;

  const response = await client.chat.completions.create({
    model: "openrouter/auto",
    messages: [
      { role: "system", content: "You are an expert code reviewer. Always respond with valid JSON only. No markdown, no explanation." },
      { role: "user", content: prompt }
    ],
    max_tokens: 2000,
  });

  const text = response.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  // Save to MongoDB
  const Review = require("../models/Review");
  // Change the Review.create call to include userId
  const saved = await Review.create({
    userId: userId || null,   // ← ADD this line
    language,
    code,
    issues: parsed.issues || [],
    suggestions: parsed.suggestions || [],
    improved_code: parsed.improved_code || "",
    score: parsed.score || 0,
    grade: parsed.grade || "N/A",
    summary: parsed.summary || "",
    time_complexity: parsed.time_complexity || null,
  });

  parsed.reviewId = saved._id;
  return parsed;
};

module.exports = { analyzeCode };