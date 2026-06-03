import { LoaderCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ReviewResult } from "@/lib/api";

type ComplexityPanelProps = {
  complexity: ReviewResult["review"]["complexity"] | null;
  isLoading: boolean;
  error?: string | null;
};

export function ComplexityPanel({ complexity, isLoading, error }: ComplexityPanelProps) {
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

  if (!complexity) {
    return (
      <div className="py-12 text-center">
        <p className="font-elegant text-2xl italic text-charcoal-light">
          Run a review to see complexity analysis.
        </p>
      </div>
    );
  }

  const chartData = (complexity.perFunction || []).map((fn) => ({
    name: fn.name,
    value: fn.cyclomaticComplexity,
  }));

  return (
    <div className="space-y-6">
      <div className="card-old-money p-6">
        <p className="eyebrow">Complexity Profile</p>
        <div className="mt-5 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <p className="font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Time</p>
            <p className="font-mono text-base text-charcoal-dark">{complexity.time}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Space</p>
            <p className="font-mono text-base text-charcoal-dark">{complexity.space}</p>
          </div>
        </div>
        <p className="mt-4 text-lg text-charcoal-light">{complexity.explanation}</p>
      </div>
      {chartData.length > 0 && (
        <div className="card-old-money h-[260px] p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="#E0D8CC" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#6B6460", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B6460", fontSize: 14, fontFamily: "Cormorant Garamond" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#FDFCF9", border: "1px solid #E0D8CC", borderRadius: "2px" }} />
              <Bar dataKey="value" fill="#A67C2E" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
