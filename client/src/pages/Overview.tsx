import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, ArrowRight, Code2, FileText, BarChart3, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { fetchDashboardStats, fetchSessions, type DashboardStats, type SessionData } from "@/lib/api";

const langColors: Record<string, string> = {
  javascript: "bg-gold", js: "bg-gold", jsx: "bg-gold",
  typescript: "bg-navy", ts: "bg-navy", tsx: "bg-navy",
  python: "bg-forest", py: "bg-forest",
  go: "bg-cognac",
  rust: "bg-charcoal-light",
  java: "bg-cognac-light",
  cpp: "bg-navy-light", c: "bg-navy-light",
};

function LangDot({ language }: { language: string }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${langColors[language.toLowerCase()] ?? "bg-stone-300"}`}
      title={language}
    />
  );
}

export function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchSessions()])
      .then(([s, sess]) => { setStats(s); setSessions(sess); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <PageWrapper className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex items-center justify-center py-20">
            <LoaderCircle size={32} className="animate-spin text-gold" />
          </div>
        </PageWrapper>
      </AppLayout>
    );
  }

  const hasData = stats && stats.totalSessions > 0;
  const maxLangCount = stats ? Math.max(...stats.languageBreakdown.map((l) => l.count), 1) : 1;

  return (
    <AppLayout>
      <PageWrapper className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-charcoal-dark">Overview</h1>
            <p className="mt-1 font-elegant text-xl text-charcoal-light">
              {hasData
                ? `${stats!.totalSessions} session${stats!.totalSessions !== 1 ? "s" : ""} across ${stats!.languageBreakdown.length} language${stats!.languageBreakdown.length !== 1 ? "s" : ""}`
                : "Start by running a review from the editor."}
            </p>
          </div>
          {hasData && (
            <Link to="/editor/session-2048" className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-light">
              New Review <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {!hasData ? (
          <div className="card-old-money p-12 text-center">
            <Code2 size={40} className="mx-auto text-stone-300" />
            <p className="mt-4 font-elegant text-2xl italic text-charcoal-light">
              No data yet. Run your first code review to populate your dashboard.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Sessions" value={stats!.totalSessions} suffix="" delta={`${stats!.totalReviews} reviews done`} tone={stats!.totalSessions > 0 ? "up" : "down"} />
              <StatCard label="Reviews Done" value={stats!.totalReviews} suffix="" delta="from AI analysis" tone={stats!.totalReviews > 0 ? "up" : "down"} />
              <StatCard label="Avg Score" value={stats!.averageScore} suffix="/100" delta="across all reviews" tone={stats!.averageScore >= 70 ? "up" : "down"} />
              <StatCard label="Best Score" value={stats!.bestScore} suffix="/100" delta={stats!.bestScore >= 85 ? "excellent quality" : "needs improvement"} tone={stats!.bestScore >= 70 ? "up" : "down"} />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="card-old-money lg:col-span-2">
                <div className="border-b border-stone-200 px-6 py-5">
                  <h2 className="flex items-center gap-2 text-3xl text-charcoal-dark">
                    <FileText size={20} className="text-stone-400" />
                    Recent Activity
                  </h2>
                </div>
                <div className="divide-y divide-stone-200">
                  {stats!.recentActivity.length === 0 ? (
                    <p className="px-6 py-8 font-elegant text-xl italic text-charcoal-light">No sessions yet.</p>
                  ) : (
                    stats!.recentActivity.map((item) => (
                      <Link key={item.id} to={`/editor/${item.id}`} className="group flex items-center gap-4 px-6 py-4 transition-colors duration-300 hover:bg-cream-100">
                        <LangDot language={item.language} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-2xl text-charcoal-dark">{item.title}</p>
                          <p className="font-mono text-xs uppercase tracking-[0.15em] text-stone-400">{item.language}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {item.score !== null ? <ScoreBadge score={item.score} /> : <span className="font-mono text-xs uppercase tracking-[0.15em] text-stone-400">No review</span>}
                          <span className="font-mono text-xs uppercase tracking-[0.14em] text-stone-400">
                            {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                          <ArrowRight size={14} className="text-stone-300 transition-colors group-hover:text-gold" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="card-old-money">
                <div className="border-b border-stone-200 px-6 py-5">
                  <h2 className="flex items-center gap-2 text-3xl text-charcoal-dark">
                    <BarChart3 size={20} className="text-stone-400" />
                    Languages
                  </h2>
                </div>
                <div className="space-y-4 p-6">
                  {stats!.languageBreakdown.length === 0 ? (
                    <p className="font-elegant text-xl italic text-charcoal-light">No languages used yet.</p>
                  ) : (
                    stats!.languageBreakdown.map((lang) => (
                      <div key={lang.language}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-charcoal-light">
                            <LangDot language={lang.language} />
                            {lang.language}
                          </span>
                          <span className="font-mono text-xs text-stone-400">{lang.count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-stone-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${langColors[lang.language.toLowerCase()] ?? "bg-stone-400"}`}
                            style={{ width: `${(lang.count / maxLangCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {sessions.length > 0 && (
              <div className="mt-8">
                <div className="card-old-money">
                  <div className="border-b border-stone-200 px-6 py-5">
                    <h2 className="flex items-center gap-2 text-3xl text-charcoal-dark">
                      <TrendingUp size={20} className="text-stone-400" />
                      Score Overview
                    </h2>
                  </div>
                  <div className="grid gap-px bg-stone-200 sm:grid-cols-3">
                    {(() => {
                      const scored = sessions.filter((s) => s.score !== undefined && s.score !== null);
                      const best = scored.length > 0 ? Math.max(...scored.map((s) => s.score!)) : 0;
                      const avg = scored.length > 0 ? Math.round(scored.reduce((a, s) => a + s.score!, 0) / scored.length) : 0;
                      const worst = scored.length > 0 ? Math.min(...scored.map((s) => s.score!)) : 0;
                      return [
                        { label: "Highest Score", value: best },
                        { label: "Average Score", value: avg },
                        { label: "Lowest Score", value: worst },
                      ].map((item) => (
                        <div key={item.label} className="bg-[#FDFCF9] px-6 py-5">
                          <p className="font-mono text-2xs uppercase tracking-[0.22em] text-stone-500">{item.label}</p>
                          <p className="mt-2 font-display text-3xl text-charcoal-dark">{item.value}<span className="ml-0.5 font-mono text-sm text-stone-400">/100</span></p>
                        </div>
                      ));
                    })()}
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