import { cn } from "@/lib/utils";

type ScoreBadgeProps = {
  score: number;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const tone =
    score > 80
      ? "border-forest-muted/40 bg-forest/10 text-forest-dark"
      : score >= 60
        ? "border-gold-muted/50 bg-gold/10 text-gold-dark"
        : "border-cognac-muted/40 bg-cognac/10 text-cognac-dark";

  return <span className={cn("score-badge", tone)}>{score}/100</span>;
}
