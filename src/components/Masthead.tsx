import Link from "next/link";

export function Masthead({
  unitName,
  weekNumber,
  dateLabel,
}: {
  unitName: string;
  weekNumber: number;
  dateLabel: string;
}) {
  return (
    <header className="border-b-[3px] pb-5" style={{ borderBottomStyle: "double" }}>
      <Link
        href="/home"
        className="mb-2 inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-sub hover:text-ink"
      >
        ← Home base
      </Link>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 font-mono text-[11px] tracking-wide text-muted uppercase">
        <span>{unitName}</span>
        <span>Vol. XII · Week {weekNumber}</span>
      </div>
      <h1 className="mt-3 text-center font-display text-[36px] font-bold text-ink sm:text-[48px] lg:text-[56px]">
        The Weekly
      </h1>
      <p className="mt-1 text-center font-serif text-[15px] italic text-sub">{dateLabel}</p>
    </header>
  );
}
