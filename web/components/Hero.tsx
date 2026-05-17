export default function Hero() {
  return (
    <section id="intro" className="relative pt-28 pb-20 px-6 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        {/* meta strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-muted mb-12">
          <span className="text-accent">● Projet ML 2K · 2026</span>
          <span>Panel 2004 à 2024</span>
          <span>21 165 observations</span>
          <span>60 langages</span>
          <span>10 sources</span>
        </div>

        <h1 className="hero-title font-display tracking-tight leading-[0.88] text-[clamp(48px,8.5vw,148px)]">
          L'IA ne tue pas <br />
          les langages <span className="italic text-muted">mais</span> <br />
          l'<span className="italic">âge</span>, le <span className="italic">niveau</span>,
          <br />
          la <span className="italic">compilation</span>, oui.
        </h1>

        <div className="mt-14 grid md:grid-cols-12 gap-10 border-t hairline pt-10">
          <p className="md:col-span-7 text-lg md:text-xl leading-relaxed text-ink/90">
            Depuis ChatGPT, on prédit la fin du code manuel. On a testé l'hypothèse
            sur 60 langages, 20 ans de données et un pipeline ML complet :
            classification, régression, SHAP, NLP. <span className="text-accent">Notre score</span>{" "}
            mesurant la "facilité de génération LLM" arrive au rang
            <span className="text-accent num"> 17/21</span> en importance. Le déclin
            d'un langage se prédit avec des facteurs structurels bien antérieurs à
            l'IA.
          </p>
          <div className="md:col-span-5 space-y-4">
            <KpiRow label="Best model · F1 macro" value="0.628" sub="LogReg L2 · ROC-AUC 0.781" />
            <KpiRow label="Baselines battues de" value="+0.17" sub="vs naïve & métier (momentum)" />
            <KpiRow label="Track record CEOs" value="0.72" sub="9 prédictions sur 15 réalisées" />
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiRow({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-baseline justify-between border-b hairline pb-3">
      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted">{label}</div>
        <div className="text-xs text-muted/80 mt-1">{sub}</div>
      </div>
      <div className="num font-display text-4xl text-accent">{value}</div>
    </div>
  );
}
