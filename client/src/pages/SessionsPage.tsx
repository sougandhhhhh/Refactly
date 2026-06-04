import { useMemo, useState, useEffect } from "react";
import { FilePlus, LoaderCircle, Search, ArrowUpDown } from "lucide-react";
import { SessionCard } from "@/components/Dashboard/SessionCard";
import { SessionTable } from "@/components/Dashboard/SessionTable";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { createSession, fetchSessions, type SessionData } from "@/lib/api";

type SortKey = "date-desc" | "date-asc" | "score-desc" | "score-asc" | "name";

export function SessionsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date-desc");
  const [langFilter, setLangFilter] = useState("all");

  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const languages = useMemo(() => {
    const set = new Set(sessions.map((s) => s.language));
    return Array.from(set).sort();
  }, [sessions]);

  const filtered = useMemo(() => {
    let result = [...sessions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q) || s.language.toLowerCase().includes(q));
    }

    if (langFilter !== "all") {
      result = result.filter((s) => s.language === langFilter);
    }

    switch (sort) {
      case "date-desc": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "date-asc": result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "score-desc": result.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)); break;
      case "score-asc": result.sort((a, b) => (a.score ?? 0) - (b.score ?? 0)); break;
      case "name": result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return result;
  }, [sessions, search, sort, langFilter]);

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleNewSession = () => {
    createSession()
      .then((s) => { window.location.href = `/editor/${s.id}`; })
      .catch(() => {});
  };

  return (
    <AppLayout>
      <PageWrapper className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-4xl text-charcoal-dark">Sessions</h1>
          <button
            onClick={handleNewSession}
            className="flex items-center gap-2 rounded-sm bg-gold px-4 py-2 font-mono text-2xs uppercase tracking-[0.18em] text-cream-50 transition-colors hover:bg-gold-dark"
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
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:max-w-xs">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search sessions…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-sm border border-stone-200 bg-[#FDFCF9] py-2 pl-9 pr-3 font-elegant text-lg text-charcoal-dark placeholder-stone-400 outline-none transition-colors focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} className="text-stone-400" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-sm border border-stone-200 bg-[#FDFCF9] px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-charcoal-dark outline-none focus:border-gold"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="score-desc">Highest Score</option>
                  <option value="score-asc">Lowest Score</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              {languages.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xs uppercase tracking-[0.15em] text-stone-400">Lang:</span>
                  <select
                    value={langFilter}
                    onChange={(e) => setLangFilter(e.target.value)}
                    className="rounded-sm border border-stone-200 bg-[#FDFCF9] px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-charcoal-dark outline-none focus:border-gold"
                  >
                    <option value="all">All</option>
                    {languages.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              )}

              <p className="font-mono text-2xs uppercase tracking-[0.15em] text-stone-400">
                {filtered.length} of {sessions.length}
              </p>
            </div>

            <SessionTable sessions={filtered} onDelete={handleDelete} />

            {filtered.length > 0 && (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {filtered.slice(0, 2).map((session) => (
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
            )}
          </>
        )}
      </PageWrapper>
    </AppLayout>
  );
}