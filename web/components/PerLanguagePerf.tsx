"use client";
import perf from "@/lib/per_language_perf.json";

export default function PerLanguagePerf() {
  const sorted = [...perf].sort((a, b) => b.f1 - a.f1);
  return (
    <div className="shadow-card rounded-md bg-bg p-5">
      <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
        <span>F1 par langage (test set, 48 obs / langage)</span>
        <span>{sorted.length} langages</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        {sorted.map((p) => {
          const tone = p.f1 >= 0.9 ? "bg-accent" : p.f1 >= 0.5 ? "bg-ink/60" : "bg-warn/70";
          return (
            <div key={p.language} className="flex items-center gap-3 text-sm">
              <span className="w-32 truncate">{p.language}</span>
              <div className="flex-1 h-1.5 bar-track rounded-full overflow-hidden">
                <div className={`h-full ${tone}`} style={{ width: `${p.f1 * 100}%` }} />
              </div>
              <span className="num text-xs text-muted w-12 text-right">{p.f1.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted mt-4 leading-relaxed">
        Quasi-parfait sur Python, Rust, TypeScript, Kotlin, Go, R (langages stables ou en
        croissance, peu de déclins à détecter). Plus difficile sur Java, PHP, Ruby : ces langages
        contiennent plus de bruit dans le signal de déclin.
      </p>
    </div>
  );
}
