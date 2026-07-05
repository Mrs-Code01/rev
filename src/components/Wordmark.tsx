export function Wordmark({ size = "md", dark = true }: { size?: "sm" | "md" | "lg" | "xl"; dark?: boolean }) {
  const sizeClass = {
    sm: "text-2xl",
    md: "text-[32px]",
    lg: "text-[46px]",
    xl: "text-[72px]",
  }[size];
  return (
    <span
      className={`font-display font-bold tracking-tight ${sizeClass}`}
      style={{ color: dark ? "#fbfaf6" : "#16140f" }}
    >
      Rev &amp; Research
    </span>
  );
}

export function EstMono({ dark = true }: { dark?: boolean }) {
  return (
    <p
      className="font-mono text-[11px] font-semibold tracking-[0.28em] uppercase"
      style={{ color: dark ? "#c0341d" : "#c0341d" }}
    >
      Est. 2025
    </p>
  );
}
