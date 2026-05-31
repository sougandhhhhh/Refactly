import { config } from "../config";

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODELS = ["gemini-2.0-flash-lite", "gemini-2.0-flash"];

const responseCache = new Map<string, { result: string; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function cacheKey(prompt: string): string {
  let hash = 5381;
  for (let i = 0; i < prompt.length; i++) {
    hash = ((hash << 5) + hash + prompt.charCodeAt(i)) & 0x7fffffff;
  }
  return String(hash);
}

async function geminiRequest(prompt: string): Promise<string> {
  if (!config.google.apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set on the server");
  }

  const ck = cacheKey(prompt);
  const cached = responseCache.get(ck);
  if (cached && cached.expiry > Date.now()) {
    console.log("Gemini cache hit");
    return cached.result;
  }

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(
          `${GEMINI_BASE}/${model}:generateContent?key=${config.google.apiKey}`,
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
          responseCache.set(ck, { result: text, expiry: Date.now() + CACHE_TTL });
          return text;
        }

        const is429 = res.status === 429;
        if (is429) {
          const wait = Math.min(2000 * 2 ** attempt, 15000);
          console.warn(`${model} rate limited (429), attempt ${attempt}/3 for this model, waiting ${wait}ms`);
          await new Promise((r) => setTimeout(r, wait));
          continue;
        }

        const body = await res.text().catch(() => "");
        throw new Error(`Gemini API error ${res.status}: ${body || "(no body)"}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.startsWith("Gemini API error")) throw err;
        if (msg.startsWith("429")) {
          const wait = Math.min(2000 * 2 ** attempt, 15000);
          await new Promise((r) => setTimeout(r, wait));
          continue;
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
