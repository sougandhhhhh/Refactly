import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function warmUpServer() {
  fetch(`${API_URL}/`, { method: "HEAD" }).catch(() => {});
}

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
  sessionId: string;
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

export type RecentActivityItem = {
  id: string;
  title: string;
  language: string;
  score: number | null;
  createdAt: string;
};

export type LanguageBreakdownItem = {
  language: string;
  count: number;
};

export type DashboardStats = {
  totalSessions: number;
  totalReviews: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalIssues: number;
  scoreHistory: Array<{ score: number; createdAt: string }>;
  recentActivity: RecentActivityItem[];
  languageBreakdown: LanguageBreakdownItem[];
};

export type SessionData = {
  id: string;
  title: string;
  language: string;
  score?: number;
  createdAt: string;
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/user/stats`, { headers });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchSessions(): Promise<SessionData[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/sessions`, { headers });
  if (!res.ok) throw new Error("Failed to fetch sessions");
  const data = await res.json();
  return data.map((s: any) => ({
    id: s.id,
    title: s.title,
    language: s.language,
    score: s.reviews?.[0]?.score ?? undefined,
    createdAt: s.createdAt,
  }));
}

export async function createSession(data?: { title?: string; language?: string; code?: string }): Promise<{ id: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers,
    body: JSON.stringify(data || {}),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}

export async function deleteSession(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/sessions/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete session");
}

export async function updateSession(id: string, data: { title?: string; language?: string; code?: string }): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/sessions/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update session");
}

export async function fetchSession(id: string): Promise<{
  id: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
  reviews: Array<{ id: string; score: number; createdAt: string }>;
}> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/sessions/${id}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export async function triggerReview(code: string, language: string, sessionId?: string): Promise<ReviewResult> {
  const headers = await getAuthHeaders();

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(`${API_URL}/review/analyze`, {
        method: "POST",
        headers,
        body: JSON.stringify({ code, language, sessionId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Review request failed" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      return res.json();
    } catch (err: unknown) {
      const isNetworkError = err instanceof TypeError;
      if (!isNetworkError || attempt === 5) throw err;
      console.warn(`Review fetch failed (attempt ${attempt}/5), retrying in 10s…`);
      await new Promise((r) => setTimeout(r, 10000));
    }
  }
  throw new Error("Review request failed");
}
