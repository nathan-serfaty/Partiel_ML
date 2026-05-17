import Image from "next/image";

export default function Figure({
  src,
  alt,
  caption,
  ratio = 16 / 9,
  bg = "#fff",
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: number;
  bg?: string;
}) {
  return (
    <figure className="shadow-card rounded-md overflow-hidden bg-bg">
      <div
        className="relative w-full"
        style={{ aspectRatio: String(ratio), background: bg }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-3"
          unoptimized
        />
      </div>
      {caption && (
        <figcaption className="px-4 py-3 text-xs text-muted border-t hairline">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
