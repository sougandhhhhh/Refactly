import NumberFlow from "@number-flow/react";
import { LoaderCircle } from "lucide-react";
import { ReviewIssueItem } from "@/components/Review/ReviewIssueItem";
import { Progress } from "@/components/ui/progress";
import type { MonacoEditorHandle } from "@/components/Editor/MonacoEditorPanel";
import type { ReviewResult } from "@/lib/api";

type AIFeedbackPanelProps = {
  review: ReviewResult["review"] | null;
  isLoading: boolean;
  error?: string | null;
  editorRef?: React.RefObject<MonacoEditorHandle | null>;
  fixedKeys?: Set<string>;
  onFixApplied?: (line: number, message: string) => void;
};

export function AIFeedbackPanel({ review, isLoading, error, editorRef, fixedKeys, onFixApplied }: AIFeedbackPanelProps) {
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

  if (!review) {
    return (
      <div className="py-12 text-center">
        <p className="font-elegant text-2xl italic text-charcoal-light">
          Press <span className="font-mono not-italic text-gold">Review Code</span> to analyze your code.
        </p>
      </div>
    );
  }

  const items = review.suggestions
    .filter((s) => !fixedKeys?.has(`${s.line}-${s.message}`))
    .map((s) => ({
      line: s.line,
      severity: s.severity,
      message: s.message,
      suggestion: s.fix,
    }));

  const scoreTone =
    review.score >= 85
      ? "bg-forest/10 text-forest-dark border-forest-muted/40"
      : review.score >= 41
        ? "bg-gold/10 text-gold-dark border-gold-muted/50"
        : "bg-cognac/10 text-cognac-dark border-cognac-muted/40";

  return (
    <div className="space-y-6">
      <section className="card-old-money p-6">
        <div className="flex items-center gap-4">
          <p className="eyebrow">Overall Score</p>
          <span className={`rounded-sm border px-3 py-1 font-mono text-sm font-medium ${scoreTone}`}>
            <NumberFlow value={review.score} />/100
          </span>
        </div>
        <p className="mt-4 font-elegant text-3xl italic leading-tight text-charcoal-light">
          {review.summary}
        </p>
        <Progress value={review.score} className="mt-5" />
      </section>

      <section className="space-y-4">
        {items.map((issue) => (
          <ReviewIssueItem key={`${issue.line}-${issue.message}`} {...issue} editorRef={editorRef} onFixApplied={onFixApplied} />
        ))}
      </section>
    </div>
  );
}
