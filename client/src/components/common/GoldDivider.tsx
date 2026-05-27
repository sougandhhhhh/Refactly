type GoldDividerProps = {
  label?: string;
};

export function GoldDivider({ label }: GoldDividerProps) {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-muted" />
      {label ? <span className="eyebrow">{label}</span> : null}
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-muted" />
    </div>
  );
}
