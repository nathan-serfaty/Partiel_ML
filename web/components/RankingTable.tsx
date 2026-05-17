"use client";
import { useMemo, useState } from "react";
import ranking from "@/lib/ranking.json";

type Row = (typeof ranking)[number];

type SortKey = "rank" | "pertinence" | "usage_pct" | "momentum_6" | "prob_decline" | "volatility_12";

const headers: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "rank", label: "#" },
  { key: "pertinence", label: "Score", align: "right" },
  { key: "usage_pct", label: "Usage %", align: "right" },
  { key: "momentum_6", label: "Momentum 6m", align: "right" },
  { key: "prob_decline", label: "P(décline)", align: "right" },
  { key: "volatility_12", label: "Volatilité", align: "right" },
];

function tier(rank: number): { label: string; color: string } {
  if (rank <= 5) return { label: "Top", color: "bg-accent text-bg" };
  if (rank <= 15) return { label: "Solide", color: "bg-accent/30 text-accent" };
  if (rank <= 40) return { label: "Stable", color: "bg-ink/10 text-muted" };
  if (rank <= 55) return { label: "À risque", color: "bg-warn/20 text-warn" };
  return { label: "Éviter", color: "bg-warn text-bg" };
}

export default function RankingTable() {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [dir, setDir] = useState<"asc" | "desc">("asc");

  const rows = useMemo(() => {
    const filtered = ranking.filter((r: Row) =>
      r.language.toLowerCase().includes(q.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      const av = (a[sortKey] as number) ?? 0;
      const bv = (b[sortKey] as number) ?? 0;
      return dir === "asc" ? av - bv : bv - av;
    });
  }, [q, sortKey, dir]);

  function setSort(k: SortKey) {
    if (k === sortKey) setDir(dir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setDir(k === "rank" ? "asc" : "desc");
    }
  }

  return (
    <div className="shadow-card rounded-md bg-bg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b hairline">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
          60 langages · cliquez sur un en-tête pour trier
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un langage…"
          className="bg-transparent border hairline rounded px-3 py-1.5 text-sm placeholder:text-muted/60 focus:outline-none focus:border-accent w-full md:w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg/50">
            <tr className="text-[11px] uppercase tracking-[0.18em] text-muted">
              <th className="px-5 py-3 text-left w-12 sticky left-0 bg-bg">
                <button onClick={() => setSort("rank")} className="hover:text-accent transition">
                  #
                </button>
              </th>
              <th className="px-3 py-3 text-left">Langage</th>
              <th className="px-3 py-3 text-left w-24">Tier</th>
              {headers.slice(1).map((h) => (
                <th key={h.key} className={`px-3 py-3 ${h.align === "right" ? "text-right" : "text-left"}`}>
                  <button
                    onClick={() => setSort(h.key)}
                    className={`hover:text-accent transition ${
                      sortKey === h.key ? "text-accent" : ""
                    }`}
                  >
                    {h.label}
                    {sortKey === h.key && (dir === "asc" ? " ↑" : " ↓")}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r: Row) => {
              const t = tier(r.rank);
              return (
                <tr key={r.language} className="border-t hairline hover:bg-ink/5 transition">
                  <td className="px-5 py-3 text-muted num sticky left-0 bg-bg">{r.rank}</td>
                  <td className="px-3 py-3 font-medium">{r.language}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm ${t.color}`}>
                      {t.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right num">
                    <ScoreBar value={r.pertinence ?? 0} />
                  </td>
                  <td className="px-3 py-3 text-right num text-muted">
                    {r.usage_pct?.toFixed(2)}
                  </td>
                  <td className={`px-3 py-3 text-right num ${(r.momentum_6 ?? 0) >= 0 ? "text-accent" : "text-warn"}`}>
                    {(r.momentum_6 ?? 0) >= 0 ? "+" : ""}
                    {((r.momentum_6 ?? 0) * 100).toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right num text-muted">
                    {(r.prob_decline ?? 0).toFixed(3)}
                  </td>
                  <td className="px-3 py-3 text-right num text-muted">
                    {(r.volatility_12 ?? 0).toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreBar({ value }: { value: number }) {
  return (
    <div className="inline-flex items-center gap-2 w-32 justify-end">
      <span className="num text-ink">{value.toFixed(3)}</span>
      <span className="w-16 h-1 bar-track rounded-full overflow-hidden">
        <span
          className="block h-full bg-accent"
          style={{ width: `${Math.min(100, value * 100)}%` }}
        />
      </span>
    </div>
  );
}
