import { Eye, EyeOff, PencilLine } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const languages = [
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
];

type EditorToolbarProps = {
  language: string;
  onLanguageChange: (lang: string) => void;
  minimapEnabled: boolean;
  onMinimapToggle: () => void;
  onReviewClick?: () => void;
  isReviewing?: boolean;
};

export function EditorToolbar({ language, onLanguageChange, minimapEnabled, onMinimapToggle, onReviewClick, isReviewing }: EditorToolbarProps) {
  const [title, setTitle] = useState("Untitled Session");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 bg-white px-4 py-4 sm:px-5 lg:h-12 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:py-0">
      <div className="flex min-w-0 items-center gap-3">
        <PencilLine size={16} className="text-gold" />
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
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onMinimapToggle}
                className="flex h-8 w-8 items-center justify-center rounded-sm text-stone-500 hover:bg-stone-100"
                aria-label={minimapEnabled ? "Hide minimap" : "Show minimap"}
              >
                {minimapEnabled ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </TooltipTrigger>
            <TooltipContent>{minimapEnabled ? "Hide minimap" : "Show minimap"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button className="w-full py-2 sm:w-auto" onClick={onReviewClick} disabled={isReviewing}>
          {isReviewing ? "Reviewing..." : "Review Code"}
        </Button>
      </div>
    </div>
  );
}
