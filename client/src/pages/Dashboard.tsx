import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScoreChart } from "@/components/Dashboard/ScoreChart";
import { SessionCard } from "@/components/Dashboard/SessionCard";
import { SessionTable } from "@/components/Dashboard/SessionTable";
import { StatCard } from "@/components/common/StatCard";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Topbar } from "@/components/Layout/Topbar";
import { sessions, stats } from "@/lib/data";

export function Dashboard() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <AppLayout>
      <PageWrapper className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Topbar />
        <div className="grid gap-5 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <section id="sessions" className="mt-10 scroll-mt-20">
          <h2 className="eyebrow mb-6">Sessions</h2>
          <SessionTable />
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {sessions.slice(0, 2).map((session) => (
              <SessionCard key={session.id} {...session} />
            ))}
          </div>
        </section>

        <section id="analytics" className="mt-10 scroll-mt-20">
          <h2 className="eyebrow mb-6">Analytics</h2>
          <ScoreChart />
        </section>

        <section id="settings" className="mt-10 scroll-mt-20">
          <h2 className="eyebrow mb-6">Settings</h2>
          <p className="text-charcoal-light">Account settings and preferences.</p>
        </section>
      </PageWrapper>
    </AppLayout>
  );
}
