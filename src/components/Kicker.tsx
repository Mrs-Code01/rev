export function Kicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`kicker ${className}`}>{children}</p>;
}

export function MonoLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`mono-label font-mono text-[11px] text-muted ${className}`}>{children}</p>;
}
