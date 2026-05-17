const parts = [
  { weight: 0.5, label: "1 - prob_décline_modèle", desc: "Sortie du LogReg L2 (calibrée)" },
  { weight: 0.25, label: "usage_actuel_normalisé", desc: "Taille du marché" },
  { weight: 0.15, label: "momentum_normalisé", desc: "Tendance récente" },
  { weight: 0.1, label: "stabilité_structurelle", desc: "1 - volatilité" },
  { weight: 0.0, label: "sentiment_communauté", desc: "Exclu, seulement 13/5000 tweets attribuables" },
];

export default function ScoreFormula() {
  return (
    <div className="shadow-card rounded-md bg-bg p-6">
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
        Score de pertinence (langage) =
      </div>
      <ul className="space-y-3">
        {parts.map((p) => (
          <li key={p.label} className="grid grid-cols-12 items-baseline gap-3">
            <span
              className={`col-span-2 md:col-span-1 num font-display text-2xl ${
                p.weight === 0 ? "text-muted/50 line-through" : "text-accent"
              }`}
            >
              {p.weight.toFixed(2)}
            </span>
            <span className="col-span-1 text-muted">×</span>
            <div className="col-span-9 md:col-span-10">
              <div className={`font-mono text-sm ${p.weight === 0 ? "text-muted/60 line-through" : "text-ink"}`}>
                {p.label}
              </div>
              <div className="text-xs text-muted">{p.desc}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted mt-5 leading-relaxed border-t hairline pt-4">
        Choix délibéré : <span className="text-ink">ai_susceptibility_score</span> est exclu car
        non prédictif (rang 17/21 SHAP). Le sentiment Twitter est exclu car signal trop faible.
        Inclure une variable non prédictive biaiserait les recommandations.
      </p>
    </div>
  );
}
