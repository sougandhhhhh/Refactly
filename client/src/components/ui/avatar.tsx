import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export const Avatar = AvatarPrimitive.Root;
export const AvatarImage = AvatarPrimitive.Image;
export const AvatarFallback = AvatarPrimitive.Fallback;

export function AvatarOld({
  initials,
  className,
  style,
}: {
  initials: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <AvatarPrimitive.Root
      className={cn("flex h-9 w-9 items-center justify-center rounded-sm border border-cream-50/30 font-mono text-xs uppercase text-cream-50 shadow-old-money", className)}
      style={style}
    >
      <AvatarPrimitive.Fallback delayMs={0}>{initials}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
