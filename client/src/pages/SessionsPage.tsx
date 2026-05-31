import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus, LoaderCircle } from "lucide-react";
import { SessionCard } from "@/components/Dashboard/SessionCard";
import { SessionTable } from "@/components/Dashboard/SessionTable";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { createSession, fetchSessions, type SessionData } from "@/lib/api";

export function SessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch(() => {/* silently fail */})
      .finally(() => setLoading(false));
  }, []);

  const handleNewSession = () => {
    createSession()
      .then((s) => {
        window.location.href = `/editor/${s.id}`;
      })
      .catch(() => {});
  };

  return (
    <AppLayout>
      <PageWrapper className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="eyebrow">Sessions</h1>
          <button
            onClick={handleNewSession}
            className="flex items-center gap-2 rounded-sm bg-gold px-4 py-2 font-mono text-2xs uppercase tracking-[0.18em] text-cream-50"
          >
            <FilePlus size={14} />
            New Session
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderCircle size={32} className="animate-spin text-gold" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </PageWrapper>
    </AppLayout>
  );
}