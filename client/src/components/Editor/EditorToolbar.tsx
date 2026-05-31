import { FilePlus, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

type EditorToolbarProps = {
  title: string;
  isEditingTitle: boolean;
  onStartEdit: () => void;
  onTitleChange: (title: string) => void;
  onFinishEdit: () => void;
  onReviewClick?: () => void;
  onNewSession?: () => void;
  isReviewing?: boolean;
};

export function EditorToolbar({
  title,
  isEditingTitle,
  onStartEdit,
  onTitleChange,
  onFinishEdit,
  onReviewClick,
  onNewSession,
  isReviewing,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 bg-white px-4 py-4 sm:px-5 lg:h-12 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:py-0">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onNewSession} className="shrink-0" aria-label="New session">
          <FilePlus size={16} className="text-gold" />
        </button>
        <button onClick={onStartEdit} className="shrink-0" aria-label="Edit title">
          <PencilLine size={16} className="text-gold" />
        </button>
        {isEditingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            onBlur={onFinishEdit}
            onKeyDown={(event) => { if (event.key === "Enter") onFinishEdit(); }}
            className="w-full min-w-0 border-b border-gold bg-transparent font-display text-xl text-charcoal-dark outline-none sm:text-2xl lg:min-w-[320px]"
          />
        ) : (
          <button
            className="truncate text-left font-display text-xl text-charcoal-dark sm:text-2xl"
            onClick={onStartEdit}
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
