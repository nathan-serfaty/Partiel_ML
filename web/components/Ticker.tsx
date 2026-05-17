const items = [
  "Python 0.898",
  "R 0.613",
  "C# 0.596",
  "TypeScript 0.578",
  "JavaScript 0.576",
  "Kotlin 0.568",
  "Go 0.532",
  "Rust 0.531",
  "Swift 0.531",
  "Java 0.520",
  "Dart 0.512",
  "PHP 0.327 ↘",
  "COBOL 0.324 ↘",
  "C 0.278 ↘",
  "VB.NET 0.268 ↘",
  "Perl 0.257 ↘",
];

export default function Ticker() {
  const all = [...items, ...items];
  return (
    <div className="border-y hairline overflow-hidden bg-bg/50">
      <div className="flex gap-12 py-3 animate-ticker whitespace-nowrap text-sm">
        {all.map((t, i) => (
          <span key={i} className="text-muted flex items-center gap-3">
            <span className="text-accent">●</span>
            <span className="num">{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
