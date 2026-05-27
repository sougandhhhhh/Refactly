import { motion } from "framer-motion";

const cursors = [
  { name: "Eleanor", color: "#2C5038", top: "18%", left: "36%" },
  { name: "Miles", color: "#A67C2E", top: "42%", left: "58%" },
];

export function CollabCursors() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {cursors.map((cursor) => (
        <motion.div
          key={cursor.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute"
          style={{ top: cursor.top, left: cursor.left }}
        >
          <div className="h-5 w-0.5" style={{ backgroundColor: cursor.color }} />
          <div
            className="mt-1 rounded-sm px-2 py-1 font-mono text-2xs uppercase tracking-[0.12em] text-cream-50 shadow-old-money"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
