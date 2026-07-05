import Link from "next/link";

export function Breadcrumb({ back, trail }: { back: string; trail: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={back}
        aria-label="Back"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
      >
        ←
      </Link>
      <p className="mono-label font-mono text-[11px] text-muted">{trail}</p>
    </div>
  );
}
