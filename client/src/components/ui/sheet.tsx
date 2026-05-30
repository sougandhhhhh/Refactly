import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

type SheetContentProps = {
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
};

export function SheetContent({ children, side = "left", className }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-charcoal-dark/50" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-0 z-50 h-full w-[280px] bg-gold p-0 shadow-old-money-lg focus:outline-none",
          side === "left" ? "left-0" : "right-0",
          className,
        )}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-sm text-charcoal-dark/50 hover:bg-charcoal-dark/10">
          <X size={16} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
