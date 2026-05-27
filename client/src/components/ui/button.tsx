import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-mono text-xs uppercase tracking-[0.22em] transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        gold: "relative overflow-hidden border border-gold-dark bg-gold px-6 py-3 text-cream-50 shadow-old-money hover:bg-gold-light",
        ghost: "border border-gold-muted px-6 py-3 text-gold hover:bg-gold/5",
        outline: "border border-stone-300 bg-cream-50 px-4 py-2 text-charcoal-light hover:bg-stone-100/70",
      },
    },
    defaultVariants: {
      variant: "gold",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />
));

Button.displayName = "Button";
