import { Link } from "react-router-dom";
import { ScoreBadge } from "@/components/common/ScoreBadge";

type SessionCardProps = {
  id: string;
  name: string;
  language: string;
  score: number;
  date: string;
};

const languageColors: Record<string, string> = {
  TypeScript: "bg-navy",
  Go: "bg-forest",
  Python: "bg-gold",
  Rust: "bg-cognac",
};

export function SessionCard({ id, name, language, score, date }: SessionCardProps) {
  return (
    <Link
      to={`/editor/${id}`}
      className="card-old-money group grid overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-old-money-lg"
    >
      <div className="grid grid-cols-[4px_1fr]">
        <div className={languageColors[language] ?? "bg-charcoal-light"} />
        <div className="p-5">
          <h3 className="text-3xl text-charcoal-dark">{name}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-3 font-elegant text-xl text-charcoal-light">
            <span>{date}</span>
            <span className="text-stone-400">/</span>
            <span>{language}</span>
            <ScoreBadge score={score} />
          </div>
        </div>
      </div>
    </Link>
  );
}
