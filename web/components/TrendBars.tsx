const ups = [
  { name: "Rust", pct: 187 },
  { name: "TypeScript", pct: 78.5 },
  { name: "Go", pct: 71.9 },
];
const downs = [
  { name: "VB.NET", pct: -35.9 },
  { name: "PHP", pct: -30.1 },
  { name: "Ruby", pct: -28.6 },
  { name: "Swift", pct: -25.8 },
];

export default function TrendBars() {
  const max = 200;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Block title="Plus fortes hausses post-LLM" items={ups} tone="accent" max={max} />
      <Block title="Plus fortes chutes post-LLM" items={downs} tone="warn" max={max} />
    </div>
  );
}

function Block({
  title,
  items,
  tone,
  max,
}: {
  title: string;
  items: { name: string; pct: number }[];
  tone: "accent" | "warn";
  max: number;
}) {
  const color = tone === "accent" ? "bg-accent" : "bg-warn";
  const text = tone === "accent" ? "text-accent" : "text-warn";
  return (
    <div className="shadow-card rounded-md p-5 bg-bg">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted mb-4">{title}</div>
      <ul className="space-y-3">
        {items.map((i) => {
          const pct = (Math.abs(i.pct) / max) * 100;
          return (
            <li key={i.name}>
              <div className="flex items-baseline justify-between text-sm">
                <span>{i.name}</span>
                <span className={`num font-display text-xl ${text}`}>
                  {i.pct > 0 ? "+" : ""}
                  {i.pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 mt-1.5 bar-track rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
