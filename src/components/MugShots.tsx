"use client";

import { useState } from "react";
import { HomeCard } from "./HomeCard";
import { Kicker } from "./Kicker";
import type { FlaggedHome } from "@/lib/types";

export function MugShots({ homes, totalCount }: { homes: FlaggedHome[]; totalCount: number }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? homes : homes.slice(0, 3);

  return (
    <section>
      <Kicker>Mug Shots · Flagged this week</Kicker>
      <div className="mt-3 flex flex-col gap-3">
        {visible.map((home) => (
          <HomeCard key={home.id} home={home} />
        ))}
      </div>
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-3 font-sans text-sm font-semibold text-blue"
        >
          See all {totalCount} →
        </button>
      )}
    </section>
  );
}
