"use client";

import { useState } from "react";
import { UNITS, DEFAULT_UNIT_ID } from "@/lib/units";

export function UnitPicker() {
  const [selected, setSelected] = useState(DEFAULT_UNIT_ID);
  const [expanded, setExpanded] = useState(false);
  const index = UNITS.findIndex((u) => u.id === selected) + 1;

  const visible = expanded ? UNITS : UNITS.slice(0, 3);
  const remaining = UNITS.length - visible.length;

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="unitId" value={selected} />

      {/* Mobile: bordered row list (P2) */}
      <div className="lg:hidden">
        <p className="mono-label mb-3 font-mono text-[11px] font-semibold text-muted">Your unit</p>
        <div className="overflow-hidden rounded-xl border border-line">
          {visible.map((unit) => {
            const isSelected = unit.id === selected;
            return (
              <button
                type="button"
                key={unit.id}
                onClick={() => setSelected(unit.id)}
                className={`flex w-full items-center justify-between border-b border-line px-4 py-3.5 text-left font-sans text-[15px] last:border-b-0 ${
                  isSelected ? "bg-ink text-paper" : "bg-white text-ink"
                }`}
              >
                {unit.name}
                {isSelected && <span className="text-red">✓</span>}
              </button>
            );
          })}
          {!expanded && remaining > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="w-full border-t border-line bg-white px-4 py-3 text-left font-mono text-[12px] tracking-wide text-muted uppercase"
            >
              + {remaining} more units
            </button>
          )}
        </div>
      </div>

      {/* Desktop: dropdown row (D2) */}
      <div className="hidden lg:block">
        <label className="font-sans text-[13px] font-medium text-sub">Your unit</label>
        <div className="relative mt-1.5">
          <select
            aria-label="Your unit"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full appearance-none rounded-[10px] border border-line bg-white px-4 py-3.5 font-serif text-[15px] text-ink focus:border-ink focus:outline-none"
          >
            {UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-sans text-sm text-muted">
            {index} of {UNITS.length} ⌄
          </span>
        </div>
      </div>
    </div>
  );
}
