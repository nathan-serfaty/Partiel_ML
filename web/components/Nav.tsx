"use client";
import { useEffect, useState } from "react";

const sections = [
  { id: "intro", label: "01 · Intro" },
  { id: "contexte", label: "02 · Contexte" },
  { id: "donnees", label: "03 · Données" },
  { id: "eda", label: "04 · EDA" },
  { id: "modeling", label: "05 · Modeling" },
  { id: "twist", label: "06 · Le twist" },
  { id: "ranking", label: "07 · Ranking" },
  { id: "sentiment", label: "08 · Sentiment" },
  { id: "limites", label: "09 · Limites" },
  { id: "conclusion", label: "10 · Conclusion" },
];

export default function Nav() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/70 border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 py-3 flex items-center justify-between gap-6">
        <a href="#intro" className="flex items-center gap-2 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-accent" />
          <span className="font-display text-lg leading-none">Partiels<span className="italic text-accent">ML</span></span>
        </a>
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`px-2 py-1 text-[11px] tracking-wide uppercase transition-colors ${
                active === s.id ? "text-accent" : "text-muted hover:text-ink"
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
        <a
          href="https://github.com/nathan-serfaty/Partiel_ML"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs uppercase tracking-wide text-muted hover:text-accent transition-colors shrink-0"
        >
          GitHub ↗
        </a>
      </div>
    </nav>
  );
}
