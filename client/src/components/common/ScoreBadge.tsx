import { cn } from "@/lib/utils";

type ScoreBadgeProps = {
  score: number;
  compact?: boolean;
};

export function ScoreBadge({ score, compact }: ScoreBadgeProps) {
  const tone =
    score >= 85
      ? "border-forest-muted/40 bg-forest/10 text-forest-dark"
      : score >= 41
        ? "border-gold-muted/50 bg-gold/10 text-gold-dark"
        : "border-cognac-muted/40 bg-cognac/10 text-cognac-dark";

  return (
    <span className={cn(
      "rounded-sm font-mono uppercase inline-flex items-center justify-center",
      compact ? "border w-[64px] h-[24px] text-[13px]" : "score-badge border-2 min-w-[80px] h-[32px] text-[16px]",
      tone,
    )}>
      {score}/100
    </span>
  );
}
