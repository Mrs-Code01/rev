import { VerdictPill } from "./VerdictPill";
import type { FlaggedHome } from "@/lib/types";

const VERDICT_LABEL: Record<FlaggedHome["verdict"], string> = {
  winner: "Winner",
  drop: "Drop",
  watch: "Watch",
};

export function HomeCard({ home }: { home: FlaggedHome }) {
  return (
    <div className="flex gap-3 rounded-xl border border-card-line bg-white p-3 sm:p-4">
      <div className="stripe-placeholder h-16 w-16 shrink-0 rounded-lg sm:h-20 sm:w-20" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate font-display text-base font-semibold text-ink">{home.address}</p>
        <p className="font-mono text-[11px] tracking-wide text-muted uppercase">
          {home.bedrooms}BR · {home.problem}
        </p>
        <div className="mt-1">
          <VerdictPill verdict={home.verdict} label={VERDICT_LABEL[home.verdict]} />
        </div>
      </div>
    </div>
  );
}
