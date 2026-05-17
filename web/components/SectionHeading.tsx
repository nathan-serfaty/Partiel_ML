export default function SectionHeading({
  id,
  index,
  title,
  kicker,
}: {
  id: string;
  index: string;
  title: React.ReactNode;
  kicker?: string;
}) {
  return (
    <div id={id} className="scroll-mt-20 pt-20 pb-10 border-t hairline">
      <div className="flex items-baseline gap-4 text-[11px] uppercase tracking-[0.18em] text-muted mb-4">
        <span className="text-accent num">{index}</span>
        {kicker && <span>{kicker}</span>}
      </div>
      <h2 className="font-display text-[clamp(36px,5.5vw,72px)] leading-[0.95] tracking-tight max-w-5xl">
        {title}
      </h2>
    </div>
  );
}
