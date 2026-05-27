import { Activity, BookOpenText, Braces, ChartSpline, Lock, ScanSearch } from "lucide-react";

export const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const slideIn = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const featureCards = [
  { title: "AI Review Engine", copy: "Context-aware reviews that read like senior engineering feedback, not generic lint output.", icon: BookOpenText },
  { title: "Real-time Collab", copy: "Presence, comments, and shared sessions for teams reviewing critical code together.", icon: Activity },
  { title: "AST Visualizer", copy: "See the architecture beneath the syntax with editorial-grade structure maps.", icon: Braces },
  { title: "Security Scanner", copy: "Quietly opinionated security checks that surface exploit paths before deployment.", icon: Lock },
  { title: "Complexity Analysis", copy: "Function-level complexity views for engineers who care about long-term maintainability.", icon: ChartSpline },
  { title: "Code Quality Score", copy: "A weighted score blending readability, correctness, performance, and security.", icon: ScanSearch },
];

export const stats: Array<{
  label: string;
  value: number;
  suffix: string;
  delta: string;
  tone: "up" | "down";
}> = [
  { label: "Total Sessions", value: 24, suffix: "", delta: "12% this week", tone: "up" },
  { label: "Reviews Done", value: 67, suffix: "", delta: "8 today", tone: "up" },
  { label: "Avg Score", value: 83, suffix: "/100", delta: "5pts gained", tone: "up" },
  { label: "Issues Found", value: 142, suffix: "", delta: "20% fewer", tone: "down" },
];

export const sessions = [
  { id: "session-2048", name: "Payments Reconciliation Service", language: "TypeScript", score: 91, date: "26 May 2026", issues: 4 },
  { id: "session-1984", name: "Identity Token Verifier", language: "Go", score: 84, date: "25 May 2026", issues: 7 },
  { id: "session-1831", name: "Portfolio Risk Aggregator", language: "Python", score: 73, date: "24 May 2026", issues: 11 },
  { id: "session-1776", name: "Merchant Payout Worker", language: "Rust", score: 58, date: "23 May 2026", issues: 16 },
];

export const chartData = [
  { label: "Mon", score: 61 },
  { label: "Tue", score: 72 },
  { label: "Wed", score: 68 },
  { label: "Thu", score: 81 },
  { label: "Fri", score: 77 },
  { label: "Sat", score: 85 },
  { label: "Sun", score: 83 },
];

export const issueItems = [
  {
    severity: "warning" as const,
    line: 18,
    message: "Potential null access when provider metadata is absent.",
    suggestion: "const provider = metadata?.provider ?? \"internal\";",
  },
  {
    severity: "error" as const,
    line: 42,
    message: "Cross-tenant cache key risks leakage across organizations.",
    suggestion: "const cacheKey = `${tenantId}:${user.id}:${scope}`;",
  },
  {
    severity: "info" as const,
    line: 57,
    message: "Loop can be simplified with a reducer to clarify intent.",
    suggestion: "return transactions.reduce((sum, txn) => sum + txn.amount, 0);",
  },
];

export const astNodes = [
  { id: "import-auth", type: "import", x: 60, y: 70, line: 1 },
  { id: "fn-review", type: "function", x: 170, y: 80, line: 12 },
  { id: "var-cache", type: "variable", x: 280, y: 65, line: 17 },
  { id: "fn-score", type: "function", x: 120, y: 180, line: 41 },
  { id: "var-flags", type: "variable", x: 250, y: 185, line: 53 },
];

export const astLinks = [
  { source: "import-auth", target: "fn-review" },
  { source: "fn-review", target: "var-cache" },
  { source: "fn-review", target: "fn-score" },
  { source: "fn-score", target: "var-flags" },
];

export const editorSample = [
  'import { auditReview } from "./services/audit";',
  "",
  "type ReviewContext = {",
  "  tenantId: string;",
  "  userId: string;",
  "  flags?: string[];",
  "};",
  "",
  "export async function reviewSubmission(context: ReviewContext, payload: string) {",
  "  const parser = await auditReview(payload);",
  '  const provider = parser.metadata?.provider ?? "internal";',
  '  const findings = parser.findings.filter((finding) => finding.severity !== "low");',
  "",
  "  const grouped = findings.reduce<Record<string, number>>((acc, finding) => {",
  "    acc[finding.rule] = (acc[finding.rule] ?? 0) + 1;",
  "    return acc;",
  "  }, {});",
  "",
  '  const cacheKey = `${context.tenantId}:${context.userId}:${provider}`;',
  "",
  "  return {",
  "    provider,",
  "    grouped,",
  "    cacheKey,",
  "    score: Math.max(48, 100 - findings.length * 4),",
  "    flags: context.flags ?? [],",
  "  };",
  "}",
  "",
].join("\n");
