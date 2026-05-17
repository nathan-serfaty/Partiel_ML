export default function Stat({
  value,
  label,
  hint,
  tone = "default",
}: {
  value: string;
  label: string;
  hint?: string;
  tone?: "default" | "accent" | "warn";
}) {
  const color = tone === "accent" ? "text-accent" : tone === "warn" ? "text-warn" : "text-ink";
  return (
    <div className="shadow-card rounded-md p-5 bg-bg flex flex-col gap-2 min-h-full">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted">{label}</div>
      <div className={`font-display num text-5xl leading-none ${color}`}>{value}</div>
      {hint && <div className="text-xs text-muted mt-1 leading-relaxed">{hint}</div>}
    </div>
  );
}
