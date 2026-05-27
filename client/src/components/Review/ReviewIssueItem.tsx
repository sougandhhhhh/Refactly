import { useState } from "react";
import { AlertCircle, AlertTriangle, ChevronDown, Info } from "lucide-react";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReviewIssueItemProps = {
  severity: "error" | "warning" | "info";
  line: number;
  message: string;
  suggestion: string;
};

const severityMap = {
  error: { icon: AlertCircle, tone: "text-cognac border-cognac-muted/30" },
  warning: { icon: AlertTriangle, tone: "text-gold border-gold-muted/30" },
  info: { icon: Info, tone: "text-navy border-navy-muted/30" },
};

export function ReviewIssueItem({ severity, line, message, suggestion }: ReviewIssueItemProps) {
  const [open, setOpen] = useState(false);
  const config = severityMap[severity];
  const Icon = config.icon;

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
          <Button
            className="mt-4 py-2"
            onClick={async () => {
              await navigator.clipboard.writeText(suggestion);
              showOldMoneyToast(`Suggested fix for line ${line} copied to clipboard.`);
            }}
          >
            Fix
          </Button>
        </div>
      ) : null}
    </article>
  );
}
