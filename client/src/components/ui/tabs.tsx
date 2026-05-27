import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return <TabsPrimitive.List className={cn("flex gap-6", className)}>{children}</TabsPrimitive.List>;
}

export function TabsTrigger({
  className,
  value,
  children,
}: {
  className?: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "border-b-2 border-b-transparent pb-4 font-body text-xl text-charcoal-light transition-colors duration-300 data-[state=active]:border-b-gold data-[state=active]:text-charcoal-dark",
        className,
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export const TabsContent = TabsPrimitive.Content;
