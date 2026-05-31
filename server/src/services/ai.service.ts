import OpenAI from "openai";
import { config } from "../config";

const openai = new OpenAI({
  apiKey: config.groq.apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

const responseCache = new Map<string, { result: string; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function cacheKey(prompt: string): string {
  let hash = 5381;
  for (let i = 0; i < prompt.length; i++) {
    hash = ((hash << 5) + hash + prompt.charCodeAt(i)) & 0x7fffffff;
  }
  return String(hash);
}

async function groqRequest(prompt: string): Promise<string> {
  if (!config.groq.apiKey) {
    throw new Error("GROQ_API_KEY is not set on the server");
  }

  const ck = cacheKey(prompt);
  const cached = responseCache.get(ck);
  if (cached && cached.expiry > Date.now()) {
    console.log("Groq cache hit");
    return cached.result;
  }

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await openai.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 4096,
        });
        const text = result.choices[0]?.message?.content;
        if (!text) throw new Error("No response from AI");
        responseCache.set(ck, { result: text, expiry: Date.now() + CACHE_TTL });
        return text;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        const is429 = msg.includes("429") || (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 429);
        if (is429 && attempt < 3) {
          const wait = Math.min(2000 * 2 ** attempt, 15000);
          console.warn(`${model} rate limited (429), attempt ${attempt}/3, waiting ${wait}ms`);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }
        if (is429) {
          console.warn(`${model} exhausted, switching models…`);
          break;
        }
        throw err;
      }
    }
  }
  throw new Error("429 status code (no body) — all models exhausted");
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
  const prompt = `You are a senior software engineer performing a code review. Analyze the following ${language} code and respond ONLY with valid JSON in this exact format. CRITICAL: Only suggest fixes that WILL INCREASE the score. Do NOT suggest cosmetic, stylistic, or unnecessary changes. If the code is clean and has no substantive issues, return an empty "suggestions" array and a score of 85-100.
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

  const text = await groqRequest(prompt);

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as AIReviewResult;
  return parsed;
}
