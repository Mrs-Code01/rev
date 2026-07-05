"use client";

import { useState } from "react";
import { choosePace } from "@/app/actions/onboarding";
import { Button } from "@/components/Button";
import type { Pace } from "@/lib/types";

function SegmentBar({ tone }: { tone: "daily" | "weekly" }) {
  return (
    <div className="mt-4 flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-1.5 flex-1 rounded-full"
          style={{
            backgroundColor: tone === "weekly" ? "#0d6b39" : i === 0 ? "#16140f" : "#d8d2c6",
          }}
        />
      ))}
    </div>
  );
}

function PaceCard({
  selected,
  onSelect,
  title,
  description,
  monoLabel,
  recommended,
  tone,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  monoLabel: string;
  recommended?: boolean;
  tone: "daily" | "weekly";
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex-1 rounded-2xl border-2 bg-white p-5 text-left transition-colors ${
        selected ? "border-ink" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
              selected ? "border-ink bg-ink text-paper" : "border-line"
            }`}
          >
            {selected && "✓"}
          </span>
          <p className="font-display text-lg font-semibold text-ink">{title}</p>
        </div>
        {recommended && (
          <span className="mono-label shrink-0 font-mono text-[10px] font-semibold text-red">
            Recommended
          </span>
        )}
      </div>
      <p className="mt-2 font-serif text-[14px] text-sub">{description}</p>
      <SegmentBar tone={tone} />
      <p className="mono-label mt-3 font-mono text-[11px] text-muted">{monoLabel}</p>
    </button>
  );
}

export function PaceForm({
  initialPace = "daily",
  redirectTo = "/feed",
  submitLabel = "Continue",
}: {
  initialPace?: Pace;
  redirectTo?: string;
  submitLabel?: string;
}) {
  const [pace, setPace] = useState<Pace>(initialPace);

  return (
    <form action={choosePace} className="mt-8 flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <PaceCard
          selected={pace === "daily"}
          onSelect={() => setPace("daily")}
          title="Daily reveal"
          description="One section unlocks each day, Mon–Wed. We'll ping you when the next is ready."
          monoLabel="MON · TUE · WED"
          recommended
          tone="daily"
        />
        <PaceCard
          selected={pace === "weekly"}
          onSelect={() => setPace("weekly")}
          title="Read it all now"
          description="All three days, unlocked at once — read at your own pace."
          monoLabel="ALL 3 DAYS · UNLOCKED"
          tone="weekly"
        />
      </div>
      <input type="hidden" name="pace" value={pace} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </form>
  );
}
