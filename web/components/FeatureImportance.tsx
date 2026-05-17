const features = [
  { name: "language_age", desc: "Âge du langage en années", rank: 1, score: 1.0, top: true },
  { name: "level_num", desc: "Niveau (low=1, mid=2, high=3)", rank: 2, score: 0.86, top: true },
  { name: "is_compiled", desc: "Compilé (1) ou interprété (0)", rank: 3, score: 0.78, top: true },
  { name: "distance_to_peak", desc: "Distance relative au pic historique", rank: 4, score: 0.72, top: true },
  { name: "usage_pct", desc: "Usage actuel", rank: 5, score: 0.66, top: true },
  { name: "momentum_6", desc: "Tendance récente sur 6 mois", rank: 6, score: 0.58 },
  { name: "ma_12", desc: "Moyenne mobile 12 mois", rank: 7, score: 0.52 },
  { name: "volatility_12", desc: "Écart-type glissant 12 mois", rank: 8, score: 0.48 },
  { name: "delta_12obs", desc: "Variation 12 observations", rank: 9, score: 0.44 },
  { name: "rank", desc: "Rang de popularité", rank: 10, score: 0.40 },
  { name: "…", desc: "(features intermédiaires omises)", rank: null, score: 0.30, ellipsis: true },
  { name: "ai_susceptibility_score", desc: "Hypothèse de départ : facilité de génération LLM", rank: 17, score: 0.18, twist: true },
  { name: "is_static_typed", desc: "Typage statique vs dynamique", rank: 18, score: 0.14 },
  { name: "horizon_num", desc: "Horizon de prédiction", rank: 19, score: 0.10 },
  { name: "max_alltime", desc: "Usage max historique", rank: 20, score: 0.06 },
  { name: "obs_count", desc: "Nombre d'obs cumulées", rank: 21, score: 0.04 },
];

export default function FeatureImportance() {
  return (
    <div className="shadow-card rounded-md bg-bg p-5">
      <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
        <span>Importance SHAP (21 features)</span>
        <span>← important · faible →</span>
      </div>
      <ul className="space-y-1.5">
        {features.map((f) => {
          const color = f.twist
            ? "bg-warn"
            : f.top
            ? "bg-accent"
            : f.ellipsis
            ? "bg-muted/30"
            : "bg-ink/40";
          const textColor = f.twist
            ? "text-warn"
            : f.top
            ? "text-ink"
            : f.ellipsis
            ? "text-muted/60 italic"
            : "text-muted";
          return (
            <li
              key={f.name + (f.rank || "")}
              className={`grid grid-cols-12 items-center gap-3 py-1.5 ${
                f.twist ? "border border-warn/30 bg-warn/5 rounded-sm px-2" : ""
              }`}
            >
              <span className={`col-span-1 num text-xs ${textColor}`}>
                {f.rank !== null ? `#${f.rank}` : ""}
              </span>
              <span className={`col-span-4 md:col-span-3 font-mono text-xs ${textColor}`}>
                {f.name}
              </span>
              <span className="hidden md:block col-span-4 text-xs text-muted/80 truncate">
                {f.desc}
              </span>
              <div className="col-span-7 md:col-span-4">
                <div className="h-1.5 rounded-full bar-track overflow-hidden">
                  <div className={`h-full ${color}`} style={{ width: `${f.score * 100}%` }} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-muted mt-4 leading-relaxed">
        <span className="text-warn">●</span> Le score <span className="font-mono">ai_susceptibility</span>, clé de notre hypothèse de départ, arrive au
        rang <span className="num text-warn">17/21</span>. Le déclin se prédit par des variables
        structurelles bien antérieures à l'IA.
      </p>
    </div>
  );
}
