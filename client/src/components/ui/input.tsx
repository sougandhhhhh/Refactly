import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-sm border border-stone-200 bg-cream-50 px-3 py-2 font-body text-base text-charcoal-dark outline-none placeholder:text-stone-400 focus:border-gold",
        className,
      )}
      {...props}
    />
  );
}
