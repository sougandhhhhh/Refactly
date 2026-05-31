import { cn } from "@/lib/utils";

type ScoreBadgeProps = {
  score: number;
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const tone =
    score >= 85
      ? "border-forest-muted/40 bg-forest/10 text-forest-dark shadow-[0_0_14px_rgba(44,80,56,0.25)]"
      : score >= 41
        ? "border-gold-muted/50 bg-gold/10 text-gold-dark shadow-[0_0_14px_rgba(166,124,46,0.25)]"
        : "border-cognac-muted/40 bg-cognac/10 text-cognac-dark shadow-[0_0_14px_rgba(107,51,32,0.25)]";

  return <span className={cn("score-badge border-2", tone)}>{score}/100</span>;
}
