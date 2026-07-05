import Link from "next/link";
import type { DayState } from "@/lib/unlock";
import { DAY_NAMES } from "@/lib/unlock";

const DAY_HREF: Record<number, string> = { 1: "/feed", 2: "/fresh-ink", 3: "/margin-read" };
const DAY_TITLE: Record<number, string> = {
  1: "Front Page · Pulse · Signed Calls · Mug Shots",
  2: "Fresh Ink",
  3: "The Margin Read",
};

export function DayGrid({ days }: { days: DayState[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {days.map((d) => {
        const content = (
          <>
            <p className="mono-label font-mono text-[11px] text-muted">{DAY_NAMES[d.day]}</p>
            <p className="mt-2 font-display text-[15px] font-semibold text-ink">{DAY_TITLE[d.day]}</p>
            <p
              className={`mt-3 font-mono text-[11px] ${d.unlocked ? "text-green" : "text-faint"}`}
            >
              {d.unlocked ? "● Live" : `🔒 ${d.countdownLabel}`}
            </p>
          </>
        );
        return d.unlocked ? (
          <Link
            key={d.day}
            href={DAY_HREF[d.day]}
            className="rounded-xl border-2 border-ink bg-white p-4 transition-shadow hover:shadow-desktop"
          >
            {content}
          </Link>
        ) : (
          <div key={d.day} className="rounded-xl border border-line bg-warm-1 p-4">
            {content}
          </div>
        );
      })}
    </div>
  );
}
