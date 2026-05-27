import NumberFlow from "@number-flow/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  suffix?: string;
  delta: string;
  tone: "up" | "down";
};

export function StatCard({ label, value, suffix = "", delta, tone }: StatCardProps) {
  const TrendIcon = tone === "up" ? ArrowUpRight : ArrowDownRight;
  const trendColor = tone === "up" ? "text-forest" : "text-cognac";

  return (
    <article className="card-old-money relative overflow-hidden p-6">
      <div className="absolute inset-y-0 left-0 w-1 bg-gold-gradient" />
      <p className="font-mono text-2xs uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <div className="mt-5 flex items-end gap-1 text-charcoal-dark">
        <span className="font-display text-4xl tracking-[-0.03em]">
          <NumberFlow value={value} />
        </span>
        {suffix ? <span className="mb-1 font-mono text-sm text-stone-500">{suffix}</span> : null}
      </div>
      <p className={`mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] ${trendColor}`}>
        <TrendIcon size={14} />
        {delta}
      </p>
    </article>
  );
}
