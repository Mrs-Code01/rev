import type { Verdict } from "@/lib/types";

const VERDICT_STYLE: Record<Verdict, { symbol: string; color: string; bg: string }> = {
  winner: { symbol: "▲", color: "#0d6b39", bg: "rgba(13,107,57,.1)" },
  drop: { symbol: "▼", color: "#c0341d", bg: "rgba(192,52,29,.1)" },
  watch: { symbol: "●", color: "#b07a17", bg: "rgba(176,122,23,.12)" },
};

export function VerdictPill({ verdict, label }: { verdict: Verdict; label: string }) {
  const style = VERDICT_STYLE[verdict];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-[12.5px] font-semibold"
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      <span aria-hidden>{style.symbol}</span>
      {label}
    </span>
  );
}
