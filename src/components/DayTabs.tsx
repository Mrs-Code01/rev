import Link from "next/link";
import type { DayState } from "@/lib/unlock";
import { DAY_LABELS } from "@/lib/unlock";

const HREF_BY_DAY: Record<number, string> = {
  1: "/feed",
  2: "/fresh-ink",
  3: "/margin-read",
};

export function DayTabs({ days, activeDay }: { days: DayState[]; activeDay: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {days.map((d) => {
        const isActive = d.day === activeDay;
        if (!d.unlocked) {
          return (
            <span
              key={d.day}
              className="flex items-center gap-1.5 rounded-full bg-warm-1 px-4 py-2 font-sans text-sm font-medium text-faint"
              title={`Unlocks in ${d.countdownLabel}`}
            >
              🔒 {DAY_LABELS[d.day]}
              <span className="font-mono text-[11px]">{d.countdownLabel}</span>
            </span>
          );
        }
        return (
          <Link
            key={d.day}
            href={HREF_BY_DAY[d.day]}
            className={`rounded-full px-4 py-2 font-sans text-sm font-medium transition-colors ${
              isActive ? "bg-ink text-paper" : "bg-transparent text-sub hover:bg-warm-1"
            }`}
          >
            {DAY_LABELS[d.day]}
          </Link>
        );
      })}
    </div>
  );
}
