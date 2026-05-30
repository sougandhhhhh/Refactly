import { LoaderCircle } from "lucide-react";
import type { ReviewResult } from "@/lib/api";

type SecurityPanelProps = {
  issues: ReviewResult["review"]["securityIssues"] | null;
  isLoading: boolean;
  error?: string | null;
};

export function SecurityPanel({ issues, isLoading, error }: SecurityPanelProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoaderCircle size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cognac-dark">Review Failed</p>
        <p className="mt-3 font-elegant text-lg italic text-charcoal-light">{error}</p>
        <p className="mt-6 font-body text-sm text-charcoal-light/70">Try again in a moment.</p>
      </div>
    );
  }

  if (!issues) {
    return (
      <div className="py-12 text-center">
        <p className="font-elegant text-2xl italic text-charcoal-light">
          Run a review to see security findings.
        </p>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-elegant text-2xl italic text-charcoal-light">
          No security issues detected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((item, i) => (
        <article key={i} className="rounded-sm border border-cognac-muted/30 border-l-4 border-l-cognac bg-cream-50 p-5 shadow-old-money">
          {item.cwe && (
            <span className="inline-flex rounded-sm border border-cognac-muted/40 bg-cognac/10 px-2 py-1 font-mono text-2xs uppercase tracking-[0.16em] text-cognac-dark">
              {item.cwe}
            </span>
          )}
          <h3 className="mt-4 text-2xl text-charcoal-dark">{item.type}</h3>
          <p className="mt-3 text-lg leading-relaxed text-charcoal-light">{item.description}</p>
          <p className="mt-4 font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Affected line {item.line}</p>
        </article>
      ))}
    </div>
  );
}
