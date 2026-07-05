"use client";

export function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className={`pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-ink px-5 py-3 font-sans text-sm font-medium text-paper shadow-desktop transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
