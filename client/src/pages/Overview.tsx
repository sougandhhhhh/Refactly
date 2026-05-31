import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Topbar } from "@/components/Layout/Topbar";
import { fetchDashboardStats, type DashboardStats } from "@/lib/api";

export function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => {/* silently fail */})
      .finally(() => setLoading(false));
  }, []);

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
          <div className="grid gap-5 lg:grid-cols-4">
            {statCards.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        )}
      </PageWrapper>
    </AppLayout>
  );
}