import NumberFlow from "@number-flow/react";
import { issueItems } from "@/lib/data";
import { ReviewIssueItem } from "@/components/Review/ReviewIssueItem";
import { Progress } from "@/components/ui/progress";

export function AIFeedbackPanel() {
  return (
    <div className="space-y-6">
      <section className="card-old-money p-6">
        <p className="eyebrow">Overall Score</p>
        <div className="mt-6 flex items-center gap-6">
          <div className="flex h-32 w-32 items-center justify-center rounded-sm border border-gold-muted/40 bg-gradient-to-b from-cream-50 to-stone-100 shadow-old-money">
            <span className="font-display text-7xl text-charcoal-dark">
              <NumberFlow value={83} />
            </span>
          </div>
          <div className="flex-1">
            <p className="font-elegant text-3xl italic leading-tight text-charcoal-light">
              Strong structure and clear intent, with a few security and tenancy boundaries that deserve a stricter hand.
            </p>
            <Progress value={83} className="mt-5" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {issueItems.map((issue) => (
          <ReviewIssueItem key={`${issue.line}-${issue.message}`} {...issue} />
        ))}
      </section>
    </div>
  );
}
