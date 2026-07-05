"use client";

import type { SignedCall } from "@/lib/types";

function tintFor(action: string): string {
  if (/drop/i.test(action)) return "rgba(192,52,29,.06)";
  if (/match|open|push/i.test(action)) return "rgba(13,107,57,.06)";
  return "transparent";
}

export function CallRow({
  call,
  checked,
  onToggle,
}: {
  call: SignedCall;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 border-b border-[#f0ebe0] px-1 py-4 last:border-b-0"
      style={{ backgroundColor: tintFor(call.action) }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-sans text-[15px] font-semibold text-ink">{call.home}</span>
        <span className="font-serif text-[14px] text-sub">{call.action}</span>
      </span>
    </label>
  );
}
