import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type ReviewSuggestion = {
  line: number;
  severity: "error" | "warning" | "info";
  message: string;
  fix: string;
};

export type SecurityIssue = {
  line: number;
  type: string;
  cwe: string;
  description: string;
  severity?: string;
};

export type ComplexityResult = {
  time: string;
  space: string;
  explanation: string;
  perFunction?: Array<{ name: string; time: string; space: string; cyclomaticComplexity: number }>;
};

export type CodeSmell = {
  line: number;
  type: string;
  suggestion: string;
};

export type ASTNode = {
  id: string;
  type: "function" | "variable" | "import" | "class";
  name: string;
  line: number;
  complexity?: number;
};

export type ASTEdge = {
  source: string;
  target: string;
  relation: string;
};

export type ReviewResult = {
  review: {
    suggestions: ReviewSuggestion[];
    securityIssues: SecurityIssue[];
    complexity: ComplexityResult;
    codeSmells: CodeSmell[];
    score: number;
    summary: string;
  };
  ast: {
    nodes: ASTNode[];
    edges: ASTEdge[];
    cyclomaticComplexity: number;
    functionCount: number;
    importCount: number;
  };
};

export async function triggerReview(code: string, language: string): Promise<ReviewResult> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/review/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code, language }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Review request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}
