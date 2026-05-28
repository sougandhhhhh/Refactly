import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  wordClassName?: string;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showDescriptor?: boolean;
  stacked?: boolean;
};

const sizeMap = {
  sm: {
    mark: "h-10 w-10",
    wordmark: "text-xl",
    descriptor: "text-[10px]",
  },
  md: {
    mark: "h-12 w-12",
    wordmark: "text-2xl",
    descriptor: "text-[11px]",
  },
  lg: {
    mark: "h-14 w-14",
    wordmark: "text-3xl",
    descriptor: "text-xs",
  },
};

export function BrandLogo({
  className,
  wordClassName,
  theme = "light",
  size = "md",
  showDescriptor = true,
  stacked = false,
}: BrandLogoProps) {
  const palette =
    theme === "dark"
      ? {
          line: "stroke-cream-50/80",
          fill: "fill-cream-50",
          border: "border-gold-muted/30",
          word: "text-cream-50",
          sub: "text-cream-50/60",
          box: "bg-gradient-to-b from-stone-700 to-stone-800",
        }
      : {
          line: "stroke-charcoal-dark/85",
          fill: "fill-charcoal-dark",
          border: "border-gold-muted/40",
          word: "text-charcoal-dark",
          sub: "text-charcoal-light/80",
          box: "bg-gradient-to-b from-cream-50 to-stone-100",
        };

  return (
    <div className={cn("inline-flex items-center gap-3", stacked && "flex-col items-start gap-2", className)}>
      <div
        className={cn(
          "relative grid place-items-center rounded-sm border shadow-old-money",
          palette.box,
          palette.border,
          sizeMap[size].mark,
        )}
      >
        <svg viewBox="0 0 64 64" className="h-[72%] w-[72%]" aria-hidden="true">
          <rect x="6.5" y="6.5" width="51" height="51" rx="1.5" fill="none" className={palette.line} strokeWidth="1" />
          <path
            d="M18 47V17h15.5c8.4 0 12.8 4 12.8 10.4 0 4.9-2.8 8-7.2 9.3L47 47h-7.7l-7-9.3h-6.4V47H18Zm7.2-15.2h8.2c3.8 0 5.9-1.5 5.9-4.6 0-3.2-2.1-4.7-5.9-4.7h-8.2v9.3Z"
            className={palette.fill}
          />
          <path d="M12 52h40" className={palette.line} strokeWidth="1" />
          <path d="M12 12h40" className={palette.line} strokeWidth="1" />
        </svg>
      </div>
      <div className="min-w-0">
        <div className={cn("font-display tracking-[0.18em]", sizeMap[size].wordmark, palette.word, wordClassName)}>REFACTLY</div>
        {showDescriptor ? (
          <div className={cn("font-mono uppercase tracking-[0.26em]", sizeMap[size].descriptor, palette.sub)}>
            Editorial Code Review
          </div>
        ) : null}
      </div>
    </div>
  );
}
