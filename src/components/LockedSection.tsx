export function LockedSection({
  fullDayName,
  countdownLabel,
}: {
  fullDayName: string;
  countdownLabel: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-warm-1 px-6 py-16 text-center">
      <span className="text-3xl">🔒</span>
      <p className="mt-4 font-display text-xl font-semibold text-ink">
        Come back tomorrow to view {fullDayName}&apos;s news.
      </p>
      <p className="mt-1 font-serif text-[15px] text-sub">Unlocks in {countdownLabel}.</p>
    </div>
  );
}
