import { config } from "../config";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-2.0-flash";

async function geminiRequest(prompt: string): Promise<string> {
  if (!config.google.apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set on the server");
  }

  let lastErr: Error | null = null;
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const res = await fetch(
        `${GEMINI_BASE}/${MODEL}:generateContent?key=${config.google.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("No response from AI");
        return text;
      }

      if (res.status === 429) {
        lastErr = new Error(`429 status code (no body)`);
        const delay = Math.min(2000 * 2 ** attempt, 30000);
        console.warn(`Gemini rate limited (429), retry ${attempt}/8 in ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      const body = await res.text().catch(() => "");
      throw new Error(`Gemini API error ${res.status}: ${body || "(no body)"}`);
    } catch (err: unknown) {
      if (err && typeof err === "object" && (err as Error).message?.startsWith("Gemini API error")) {
        throw err; // non-429, fail fast
      }
      if (err && typeof err === "object" && (err as Error).message?.startsWith("429")) {
        lastErr = err as Error;
        continue; // already handled above, but catch network errors here
      }
      // network error — retry
      lastErr = err as Error;
      const delay = Math.min(2000 * 2 ** attempt, 30000);
      console.warn(`Gemini request failed (${(err as Error).message}), retry ${attempt}/8 in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr || new Error("Gemini request failed after 8 retries");
}

export interface AIReviewResult {
  suggestions: Array<{ line: number; severity: "error" | "warning" | "info"; message: string; fix: string }>;
  security: Array<{ line: number; type: string; cwe: string; description: string }>;
  complexity: { time: string; space: string; explanation: string };
  codeSmells: Array<{ line: number; type: string; suggestion: string }>;
  score: number;
  summary: string;
}

export async function runAIReview(code: string, language: string): Promise<AIReviewResult> {
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

  const text = await geminiRequest(prompt);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as AIReviewResult;
  return parsed;
}
