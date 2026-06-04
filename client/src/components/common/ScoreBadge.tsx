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
      "rounded-sm border-2 font-mono uppercase",
      compact ? "px-1.5 py-0.5 text-[10px] leading-none" : "score-badge border-2",
      tone,
    )}>
      {score}/100
    </span>
  );
}
