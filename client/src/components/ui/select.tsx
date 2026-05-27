import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex items-center gap-3 rounded-sm border border-stone-200 bg-cream-50 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-charcoal-light",
        className,
      )}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown size={14} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className="overflow-hidden rounded-sm border border-stone-200 bg-cream-50 shadow-old-money">
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <SelectPrimitive.Item
      value={value}
      className="relative flex cursor-default select-none items-center rounded-sm py-2 pl-9 pr-6 font-body text-xl text-charcoal-dark outline-none data-[highlighted]:bg-stone-100"
    >
      <span className="absolute left-3 inline-flex items-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={14} className="text-gold" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
