import { useState } from "react";
import { AlertCircle, AlertTriangle, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { MonacoEditorHandle } from "@/components/Editor/MonacoEditorPanel";
import { cn } from "@/lib/utils";

type ReviewIssueItemProps = {
  severity: "error" | "warning" | "info";
  line: number;
  message: string;
  suggestion: string;
  editorRef?: React.RefObject<MonacoEditorHandle | null>;
  onFixApplied?: (line: number, message: string) => void;
};

const severityMap = {
  error: { icon: AlertCircle, tone: "text-cognac border-cognac-muted/30" },
  warning: { icon: AlertTriangle, tone: "text-gold border-gold-muted/30" },
  info: { icon: Info, tone: "text-navy border-navy-muted/30" },
};

export function ReviewIssueItem({ severity, line, message, suggestion, editorRef, onFixApplied }: ReviewIssueItemProps) {
  const [open, setOpen] = useState(false);
  const [fixDialogOpen, setFixDialogOpen] = useState(false);
  const config = severityMap[severity];
  const Icon = config.icon;

  const handleApplyFix = () => {
    editorRef?.current?.applyFix(line, suggestion);
    onFixApplied?.(line, message);
    setFixDialogOpen(false);
    setOpen(false);
  };

  return (
    <article className={cn("rounded-sm border bg-cream-50/80", config.tone)}>
      <button
        className="flex w-full items-start gap-3 px-4 py-4 text-left"
        onClick={() => setOpen((value) => !value)}
      >
        <Icon size={16} className="mt-1 shrink-0" />
        <div className="flex-1">
          <p className="font-mono text-2xs uppercase tracking-[0.16em] text-stone-500">Line {line}</p>
          <p className="mt-1 text-xl leading-snug text-charcoal-dark">{message}</p>
        </div>
        <ChevronDown size={16} className={cn("mt-1 transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="border-t border-stone-200 px-4 py-4">
          <pre className="overflow-x-auto rounded-sm border border-stone-200 bg-stone-100/80 p-4 font-mono text-sm leading-relaxed text-charcoal-dark">
            {suggestion}
          </pre>
          <Dialog open={fixDialogOpen} onOpenChange={setFixDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 py-2">Fix</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="font-display text-2xl text-charcoal-dark">Apply Fix</DialogTitle>
              <p className="mt-4 text-charcoal-light">
                Replace line {line} with the suggested code?
              </p>
              <pre className="mt-3 max-h-40 overflow-auto rounded-sm border border-stone-200 bg-stone-100/80 p-3 font-mono text-xs leading-relaxed text-charcoal-dark">
                {suggestion}
              </pre>
              <div className="mt-8 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  className="border border-stone-300 text-charcoal-dark hover:bg-stone-100"
                  onClick={() => setFixDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-forest-dark text-cream-50 hover:bg-forest-dark/90"
                  onClick={handleApplyFix}
                >
                  Apply Fix
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}
    </article>
  );
}
