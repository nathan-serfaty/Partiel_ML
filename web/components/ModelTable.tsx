const rows = [
  { name: "Baseline naïve (majorité)", f1: 0.459, auc: null, pr: null, tone: "muted" },
  { name: "Baseline métier (momentum+delta)", f1: 0.451, auc: null, pr: null, tone: "muted" },
  { name: "LogReg L2", f1: 0.628, auc: 0.781, pr: 0.434, tone: "winner" },
  { name: "LightGBM", f1: 0.543, auc: 0.693, pr: 0.281, tone: "default" },
  { name: "XGBoost", f1: 0.55, auc: 0.685, pr: 0.298, tone: "default" },
  { name: "Random Forest", f1: 0.521, auc: 0.695, pr: 0.304, tone: "default" },
];

export default function ModelTable() {
  const max = 0.85;
  return (
    <div className="shadow-card rounded-md overflow-hidden bg-bg">
      <div className="px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-muted border-b hairline flex justify-between">
        <span>Modèle</span>
        <span className="hidden md:flex gap-12">
          <span className="w-24 text-right">F1 macro</span>
          <span className="w-20 text-right">ROC-AUC</span>
          <span className="w-20 text-right">PR-AUC</span>
        </span>
      </div>
      <ul>
        {rows.map((r) => {
          const pct = (r.f1 / max) * 100;
          const color =
            r.tone === "winner" ? "bg-accent" : r.tone === "muted" ? "bg-muted/40" : "bg-ink/60";
          return (
            <li key={r.name} className="px-5 py-4 border-b hairline last:border-b-0">
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {r.tone === "winner" && (
                    <span className="text-[10px] uppercase tracking-wider text-bg bg-accent px-1.5 py-0.5 rounded-sm">
                      best
                    </span>
                  )}
                  <span
                    className={
                      r.tone === "winner"
                        ? "text-ink font-medium"
                        : r.tone === "muted"
                        ? "text-muted"
                        : "text-ink"
                    }
                  >
                    {r.name}
                  </span>
                </div>
                <div className="flex items-center gap-12 num text-sm w-full md:w-auto">
                  <span className="w-24 text-right">{r.f1.toFixed(3)}</span>
                  <span className="w-20 text-right text-muted">
                    {r.auc !== null ? r.auc.toFixed(3) : "·"}
                  </span>
                  <span className="w-20 text-right text-muted">
                    {r.pr !== null ? r.pr.toFixed(3) : "·"}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1 bar-track rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="px-5 py-3 text-xs text-muted border-t hairline">
        <span className="text-accent">LogReg L2</span> bat les baselines de{" "}
        <span className="text-ink num">+0.17</span> F1 (CIs non chevauchants, 95 % bootstrap par
        bloc). Les modèles à arbres sur-apprennent : XGB CV F1 = 0.74 vs test = 0.54.
      </div>
    </div>
  );
}
