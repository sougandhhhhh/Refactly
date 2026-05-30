import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { staggerContainer, staggerItem } from "@/lib/data";
import type { SessionData } from "@/lib/api";

type SessionTableProps = {
  sessions: SessionData[];
};

export function SessionTable({ sessions }: SessionTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="card-old-money p-8 text-center">
        <p className="font-elegant text-2xl italic text-charcoal-light">
          No sessions yet. Create a session from the editor to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="card-old-money overflow-hidden">
      <div className="border-b border-stone-200 px-6 py-5">
        <h2 className="text-3xl text-charcoal-dark">Recent Sessions</h2>
      </div>
      <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
        <div className="grid grid-cols-[2fr_0.9fr_0.8fr_0.9fr_0.7fr] border-b border-stone-200 px-6 py-3 font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">
          <span>Session Name</span>
          <span>Language</span>
          <span>Score</span>
          <span>Date</span>
          <span>Action</span>
        </div>
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            variants={staggerItem}
            className="grid grid-cols-[2fr_0.9fr_0.8fr_0.9fr_0.7fr] items-center border-b border-stone-200 px-6 py-4 text-lg transition-colors duration-300 hover:bg-cream-100"
          >
            <span className="text-2xl text-charcoal-dark">{session.title}</span>
            <span>{session.language}</span>
            <ScoreBadge score={session.score ?? 0} />
            <span className="font-mono text-sm uppercase tracking-[0.14em] text-stone-500">
              {new Date(session.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <Link to={`/editor/${session.id}`} className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
              Open
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
