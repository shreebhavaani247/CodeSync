import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function analyzeCode(code, language) {
  try {
    console.log("Calling Gemini REST API (v1, 2.5-flash)...");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a strict technical interviewer.

Analyze this ${language} code.

Give:
1. Correctness feedback
2. Optimization suggestions
3. Time and space complexity
4. 2 interview questions

Keep response clean and structured.

Code:
${code}`
              }
            ]
          }
        ]
      }
    );

    // ✅ Safe extraction
    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("AI TEXT:", text);

    return text || "No response from AI";

  } catch (err) {
    console.error(
      "GEMINI REST ERROR:",
      err?.response?.data || err.message
    );

    return "AI analysis failed. Try again.";
  }
}

export { analyzeCode };