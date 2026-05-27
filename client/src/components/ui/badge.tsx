import * as React from "react";
import { cn } from "@/lib/utils";

export const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("inline-flex items-center rounded-sm border px-2.5 py-1 font-mono text-2xs uppercase tracking-[0.18em]", className)}
    {...props}
  />
));

Badge.displayName = "Badge";
