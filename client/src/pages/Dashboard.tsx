import { ScoreChart } from "@/components/Dashboard/ScoreChart";
import { SessionCard } from "@/components/Dashboard/SessionCard";
import { SessionTable } from "@/components/Dashboard/SessionTable";
import { StatCard } from "@/components/common/StatCard";
import { Sidebar } from "@/components/Layout/Sidebar";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Topbar } from "@/components/Layout/Topbar";
import { sessions, stats } from "@/lib/data";

export function Dashboard() {
  return (
    <PageWrapper className="flex min-h-screen flex-col bg-page-texture lg:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Topbar />
        <div className="grid gap-5 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-10 grid gap-10 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <SessionTable />
            <div className="grid gap-5 md:grid-cols-2">
              {sessions.slice(0, 2).map((session) => (
                <SessionCard key={session.id} {...session} />
              ))}
            </div>
          </div>
          <ScoreChart />
        </div>
      </div>
    </PageWrapper>
  );
}
