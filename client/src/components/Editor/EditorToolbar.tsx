import { PencilLine } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";


const languages = [
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
];

type EditorToolbarProps = {
  onReviewClick?: () => void;
  isReviewing?: boolean;
};

export function EditorToolbar({ onReviewClick, isReviewing }: EditorToolbarProps) {
  const [title, setTitle] = useState("Untitled Session");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 bg-white px-4 py-4 sm:px-5 lg:h-12 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:py-0">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={() => setIsEditingTitle(true)} className="shrink-0" aria-label="Edit title">
          <PencilLine size={16} className="text-gold" />
        </button>
        {isEditingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(event) => { if (event.key === "Enter") setIsEditingTitle(false); }}
            className="w-full min-w-0 border-b border-gold bg-transparent font-display text-xl text-charcoal-dark outline-none sm:text-2xl lg:min-w-[320px]"
          />
        ) : (
          <button
            className="truncate text-left font-display text-xl text-charcoal-dark sm:text-2xl"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </button>
        )}
      </div>
      <Button className="w-full py-2 sm:w-auto" onClick={onReviewClick} disabled={isReviewing}>
        {isReviewing ? "Reviewing..." : "Review Code"}
      </Button>
    </div>
  );
}
