import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/data";
import { deleteSession, type SessionData } from "@/lib/api";

type SessionTableProps = {
  sessions: SessionData[];
  onDelete?: (id: string) => void;
};

export function SessionTable({ sessions, onDelete }: SessionTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="card-old-money p-8 text-center">
        <p className="font-elegant text-2xl italic text-charcoal-light">
          No sessions yet. Create a session from the editor to get started.
        </p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteSession(id);
      onDelete?.(id);
    } catch {
      /* silently fail */
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="card-old-money overflow-hidden">
      <div className="border-b border-stone-200 px-6 py-5">
        <h2 className="text-3xl text-charcoal-dark">Lifetime Sessions</h2>
      </div>
      <div className="grid grid-cols-[2fr_0.7fr_0.7fr_1fr_0.6fr_0.5fr] border-b border-stone-200 px-6 py-3 font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">
        <span>Session Name</span>
        <span>Language</span>
        <span>Score</span>
        <span>Date</span>
        <span>Action</span>
        <span />
      </div>
      <div className="h-[440px] overflow-y-auto">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              variants={staggerItem}
              className="grid grid-cols-[2fr_0.7fr_0.7fr_1fr_0.6fr_0.5fr] items-center border-b border-stone-200 px-6 py-3.5 text-lg transition-colors duration-300 hover:bg-cream-100"
            >
              <span className="truncate text-2xl text-charcoal-dark">{session.title}</span>
              <span className="font-elegant text-base text-charcoal-light">{session.language}</span>
              <ScoreBadge score={session.score ?? 0} compact />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-stone-500">
                {new Date(session.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <Link to={`/editor/${session.id}`} className="font-mono text-xs uppercase tracking-[0.18em] text-gold hover:text-gold-light">
                Open
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="flex items-center justify-center rounded-sm p-1.5 text-stone-400 transition-colors hover:bg-cognac/10 hover:text-cognac"
                    title="Delete session"
                  >
                    <Trash2 size={14} />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle className="font-display text-2xl text-charcoal-dark">Delete Session</DialogTitle>
                  <p className="mt-4 text-charcoal-light">
                    Are you sure you want to delete <span className="font-medium text-charcoal-dark">&ldquo;{session.title}&rdquo;</span>? This action cannot be undone.
                  </p>
                  <div className="mt-8 flex justify-end gap-3">
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="border border-stone-300 text-charcoal-dark hover:bg-stone-100">Cancel</Button>
                    </DialogTrigger>
                    <Button
                      className="bg-cognac-dark text-cream-50 hover:bg-cognac-dark/90"
                      disabled={deleting === session.id}
                      onClick={() => handleDelete(session.id)}
                    >
                      {deleting === session.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
