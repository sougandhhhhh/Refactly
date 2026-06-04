import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, BarChart3, Layers, CalendarDays } from "lucide-react";
import { ScoreChart } from "@/components/Dashboard/ScoreChart";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { fetchDashboardStats, type DashboardStats } from "@/lib/api";
import NumberFlow from "@number-flow/react";

const langColors: Record<string, string> = {
  javascript: "bg-gold", js: "bg-gold", jsx: "bg-gold",
  typescript: "bg-navy", ts: "bg-navy", tsx: "bg-navy",
  python: "bg-forest", py: "bg-forest",
  go: "bg-cognac",
  rust: "bg-charcoal-light",
  java: "bg-cognac-light",
  cpp: "bg-navy-light", c: "bg-navy-light",
};

function MiniStat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="card-old-money p-5">
      <p className="font-mono text-2xs uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <div className="mt-3 flex items-end gap-1">
        <span className="font-display text-3xl tracking-[-0.03em] text-charcoal-dark">
          <NumberFlow value={value} />
        </span>
        {suffix && <span className="mb-0.5 font-mono text-xs text-stone-400">{suffix}</span>}
      </div>
    </div>
  );
}

type TimeRange = "7d" | "30d" | "90d" | "all";

export function Analytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = useMemo(() => {
    if (!stats) return [];
    if (timeRange === "all") return stats.scoreHistory;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(timeRange));
    return stats.scoreHistory.filter((h) => new Date(h.createdAt) >= cutoff);
  }, [stats, timeRange]);

  const distribution = useMemo(() => {
    if (!stats) return [];
    const bins = [
      { label: "0-20", min: 0, max: 20, color: "bg-cognac" },
      { label: "21-40", min: 21, max: 40, color: "bg-cognac-light" },
      { label: "41-60", min: 41, max: 60, color: "bg-gold" },
      { label: "61-80", min: 61, max: 80, color: "bg-forest-light" },
      { label: "81-100", min: 81, max: 100, color: "bg-forest" },
    ];
    return bins.map((bin) => ({
      ...bin,
      count: filteredHistory.filter((h) => h.score >= bin.min && h.score <= bin.max).length,
    }));
  }, [filteredHistory]);

  const maxDistCount = useMemo(() => Math.max(...distribution.map((d) => d.count), 1), [distribution]);
  const maxLangCount = stats ? Math.max(...stats.languageBreakdown.map((l) => l.count), 1) : 1;
  const hasData = stats && stats.totalReviews > 0;

  return (
    <AppLayout>
      <PageWrapper className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-charcoal-dark">Analytics</h1>
          <p className="mt-1 font-elegant text-xl text-charcoal-light">
            {hasData ? `${stats!.totalReviews} review${stats!.totalReviews !== 1 ? "s" : ""} · ${stats!.scoreHistory.length} data points` : "Run a review to see analytics."}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderCircle size={32} className="animate-spin text-gold" />
          </div>
        ) : !hasData ? (
          <div className="card-old-money p-12 text-center">
            <BarChart3 size={40} className="mx-auto text-stone-300" />
            <p className="mt-4 font-elegant text-2xl italic text-charcoal-light">
              No analytics yet. Run your first code review to see insights.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-4">
              <MiniStat label="Total Reviews" value={stats!.totalReviews} />
              <MiniStat label="Average Score" value={stats!.averageScore} suffix="/100" />
              <MiniStat label="Best Score" value={stats!.bestScore} suffix="/100" />
              <MiniStat label="Issues Found" value={stats!.totalIssues} />
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div />
                <div className="flex items-center gap-1 rounded-sm border border-stone-200 bg-[#FDFCF9] p-0.5">
                  <CalendarDays size={14} className="ml-2 text-stone-400" />
                  {(["7d", "30d", "90d", "all"] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`rounded-sm px-3 py-1 font-mono text-2xs uppercase tracking-[0.15em] transition-colors ${
                        timeRange === range
                          ? "bg-gold text-cream-50"
                          : "text-stone-500 hover:text-charcoal-dark"
                      }`}
                    >
                      {range === "all" ? "All Time" : range}
                    </button>
                  ))}
                </div>
              </div>
              <ScoreChart scoreHistory={filteredHistory} title={`Score Graph (${filteredHistory.length} data points)`} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="card-old-money">
                <div className="border-b border-stone-200 px-6 py-5">
                  <h2 className="flex items-center gap-2 text-3xl text-charcoal-dark">
                    <BarChart3 size={20} className="text-stone-400" />
                    Score Distribution
                  </h2>
                </div>
                <div className="space-y-4 p-6">
                  {distribution.map((bin) => (
                    <div key={bin.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-[0.15em] text-stone-500">{bin.label}</span>
                        <span className="font-mono text-xs text-stone-400">{bin.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                        <div className={`h-full rounded-full transition-all duration-500 ${bin.color}`} style={{ width: `${(bin.count / maxDistCount) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                  {stats!.scoreHistory.length === 0 && <p className="font-elegant text-xl italic text-charcoal-light">No score data yet.</p>}
                </div>
              </div>

              <div className="card-old-money">
                <div className="border-b border-stone-200 px-6 py-5">
                  <h2 className="flex items-center gap-2 text-3xl text-charcoal-dark">
                    <Layers size={20} className="text-stone-400" />
                    Languages Reviewed
                  </h2>
                </div>
                <div className="space-y-4 p-6">
                  {stats!.languageBreakdown.length === 0 ? (
                    <p className="font-elegant text-xl italic text-charcoal-light">No language data yet.</p>
                  ) : (
                    stats!.languageBreakdown.map((lang) => {
                      const color = langColors[lang.language.toLowerCase()] ?? "bg-stone-400";
                      return (
                        <div key={lang.language}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-charcoal-light">
                              <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
                              {lang.language}
                            </span>
                            <span className="font-mono text-xs text-stone-400">{lang.count} session{lang.count !== 1 ? "s" : ""}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                            <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${(lang.count / maxLangCount) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {stats!.scoreHistory.length > 2 && (
              <div className="mt-6">
                <div className="card-old-money p-6">
                  <h2 className="flex items-center gap-2 text-3xl text-charcoal-dark">
                    <Layers size={20} className="text-stone-400" />
                    Summary
                  </h2>
                  <div className="mt-4 grid gap-4 font-elegant text-xl text-charcoal-light sm:grid-cols-3">
                    <p>
                      Highest recorded score: <span className="font-display text-2xl text-forest">{stats!.bestScore}</span>/100
                    </p>
                    <p>
                      Lowest recorded score: <span className="font-display text-2xl text-cognac">{stats!.worstScore}</span>/100
                    </p>
                    <p>
                      Average across <span className="font-display text-2xl text-charcoal-dark">{stats!.totalReviews}</span> review{stats!.totalReviews !== 1 ? "s" : ""}: <span className="font-display text-2xl text-gold">{stats!.averageScore}</span>/100
                    </p>
                  </div>
                  <div className="mt-4 border-t border-stone-200 pt-4">
                    <Link to="/sessions" className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-light">
                      View all sessions <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </AppLayout>
  );
}