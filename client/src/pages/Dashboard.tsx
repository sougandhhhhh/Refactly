import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { ScoreChart } from "@/components/Dashboard/ScoreChart";
import { SessionCard } from "@/components/Dashboard/SessionCard";
import { SessionTable } from "@/components/Dashboard/SessionTable";
import { StatCard } from "@/components/common/StatCard";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Topbar } from "@/components/Layout/Topbar";
import { fetchDashboardStats, fetchSessions, type DashboardStats, type SessionData } from "@/lib/api";

export function Dashboard() {
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboardStats(), fetchSessions()])
      .then(([s, sessionsData]) => {
        setStats(s);
        setSessions(sessionsData);
      })
      .catch(() => {/* silently fail */})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  const statCards = stats
    ? [
        { label: "Total Sessions", value: stats.totalSessions, suffix: "", delta: `${stats.totalReviews} reviews done`, tone: stats.totalSessions > 0 ? "up" as const : "down" as const },
        { label: "Reviews Done", value: stats.totalReviews, suffix: "", delta: "from AI analysis", tone: stats.totalReviews > 0 ? "up" as const : "down" as const },
        { label: "Avg Score", value: stats.averageScore, suffix: "/100", delta: "latest reviews", tone: stats.averageScore >= 70 ? "up" as const : "down" as const },
        { label: "Issues Found", value: stats.totalReviews > 0 ? 0 : 0, suffix: "", delta: "per review", tone: "down" as const },
      ]
    : [];

  return (
    <AppLayout>
      <PageWrapper className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Topbar />
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderCircle size={32} className="animate-spin text-gold" />
          </div>
        ) : (
          <>
            {statCards.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-4">
                {statCards.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            )}
            <section id="sessions" className="mt-10 scroll-mt-20">
              <h2 className="eyebrow mb-6">Sessions</h2>
              <SessionTable sessions={sessions} />
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {sessions.slice(0, 2).map((session) => (
                  <SessionCard
                    key={session.id}
                    id={session.id}
                    name={session.title}
                    language={session.language}
                    score={session.score ?? 0}
                    date={new Date(session.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  />
                ))}
              </div>
            </section>
            <section id="analytics" className="mt-10 scroll-mt-20">
              <h2 className="eyebrow mb-6">Analytics</h2>
              <ScoreChart scoreHistory={stats?.scoreHistory ?? []} />
            </section>

          </>
        )}
      </PageWrapper>
    </AppLayout>
  );
}
