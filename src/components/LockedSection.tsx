export function LockedSection({ dayName, timeLabel }: { dayName: string; timeLabel: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-warm-1 px-6 py-16 text-center">
      <span className="text-3xl">🔒</span>
      <p className="mt-4 font-display text-xl font-semibold text-ink">Not yet — patience.</p>
      <p className="mt-1 font-serif text-[15px] text-sub">
        Unlocks {dayName} {timeLabel}.
      </p>
    </div>
  );
}
