const sources = [
  { name: "Stack Overflow Developer Survey", type: "% usage déclaré", cov: "2017 à 2024 (6 ans)", gran: "Annuel" },
  { name: "TIOBE Index", type: "Part de marché (requêtes)", cov: "Juil. 2004 à Déc. 2024", gran: "Mensuel" },
  { name: "GitHub Issues + PRs", type: "Activité open-source", cov: "Q3 2011 à Q4 2022", gran: "Trimestriel" },
  { name: "GitHub Daily Trending", type: "Repos tendance", cov: "Nov. 2024 à Oct. 2025", gran: "Quotidien" },
  { name: "Twitter Entity Sentiment", type: "Sentiment générique", cov: "~75 000 tweets", gran: "Ponctuel" },
];

export default function SourcesTable() {
  return (
    <div className="shadow-card rounded-md bg-bg overflow-hidden">
      <div className="grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-muted border-b hairline">
        <span className="col-span-5">Source</span>
        <span className="col-span-3">Type</span>
        <span className="col-span-3">Couverture</span>
        <span className="col-span-1 text-right">Gran.</span>
      </div>
      {sources.map((s) => (
        <div
          key={s.name}
          className="grid grid-cols-12 px-5 py-4 text-sm border-b hairline last:border-b-0 items-baseline"
        >
          <span className="col-span-5 text-ink">{s.name}</span>
          <span className="col-span-3 text-muted">{s.type}</span>
          <span className="col-span-3 text-muted num">{s.cov}</span>
          <span className="col-span-1 text-right text-accent text-[11px] uppercase tracking-wider">
            {s.gran}
          </span>
        </div>
      ))}
    </div>
  );
}
