import OpenAI from "openai";
import { config } from "../config";

const openai = new OpenAI({
  apiKey: config.google.apiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  maxRetries: 5,
});

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 5): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      if (attempt === maxAttempts) throw err;
      const status = err && typeof err === "object" && "status" in err
        ? (err as { status: number }).status
        : null;
      if (status === 429) {
        const delay = Math.min(1000 * 2 ** attempt, 15000);
        console.warn(`AI rate limited (429), retry ${attempt}/${maxAttempts} in ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Unexpected retry exit");
}

export interface AIReviewResult {
  suggestions: Array<{ line: number; severity: "error" | "warning" | "info"; message: string; fix: string }>;
  security: Array<{ line: number; type: string; cwe: string; description: string }>;
  complexity: { time: string; space: string; explanation: string };
  codeSmells: Array<{ line: number; type: string; suggestion: string }>;
  score: number;
  summary: string;
}

const REVIEW_MODEL = "gemini-2.0-flash";

export async function runAIReview(code: string, language: string): Promise<AIReviewResult> {
  if (!config.google.apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set on the server");
  }
  const prompt = `You are a senior software engineer performing a code review. Analyze the following ${language} code and respond ONLY with valid JSON in this exact format:
{
  "suggestions": [
    { "line": <number>, "severity": "error|warning|info", "message": "<issue>", "fix": "<corrected code snippet>" }
  ],
  "security": [
    { "line": <number>, "type": "<vuln type>", "cwe": "<CWE-XXX>", "description": "<explanation>" }
  ],
  "complexity": {
    "time": "<Big-O>", "space": "<Big-O>", "explanation": "<1-2 sentences>"
  },
  "codeSmells": [
    { "line": <number>, "type": "<smell type>", "suggestion": "<improvement>" }
  ],
  "score": <0-100>,
  "summary": "<2-3 sentence overall review>"
}

Code to review:
\`\`\`${language}
${code}
\`\`\``;

  const result = await withRetry(() =>
    openai.chat.completions.create({
      model: REVIEW_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 4096,
    })
  );

  const text = result.choices[0].message.content;
  if (!text) {
    throw new Error("No response from AI");
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as AIReviewResult;
  return parsed;
}
