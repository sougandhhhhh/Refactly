import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { ScoreChart } from "@/components/Dashboard/ScoreChart";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { fetchDashboardStats, type DashboardStats } from "@/lib/api";

export function Analytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => {/* silently fail */})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <PageWrapper className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <h1 className="eyebrow mb-6">Analytics</h1>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderCircle size={32} className="animate-spin text-gold" />
          </div>
        ) : (
          <ScoreChart scoreHistory={stats?.scoreHistory ?? []} />
        )}
      </PageWrapper>
    </AppLayout>
  );
}