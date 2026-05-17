export default function Quote({
  text,
  author,
  org,
  status,
}: {
  text: string;
  author: string;
  org: string;
  status?: "réalisée" | "en cours" | "non réalisée";
}) {
  const tone =
    status === "réalisée"
      ? "border-accent/40 text-accent"
      : status === "non réalisée"
      ? "border-warn/40 text-warn"
      : "border-muted/30 text-muted";
  return (
    <blockquote className="shadow-card rounded-md p-6 bg-bg flex flex-col gap-4 min-h-full">
      <p className="font-display italic text-xl leading-snug">"{text}"</p>
      <div className="mt-auto flex items-baseline justify-between gap-3 text-xs">
        <div>
          <div className="text-ink">{author}</div>
          <div className="text-muted">{org}</div>
        </div>
        {status && (
          <span className={`uppercase tracking-wider border px-2 py-1 rounded-sm ${tone}`}>
            {status}
          </span>
        )}
      </div>
    </blockquote>
  );
}
