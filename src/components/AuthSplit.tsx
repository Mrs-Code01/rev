import type { ReactNode } from "react";
import { EstMono, Wordmark } from "./Wordmark";

export function AuthSplit({
  leftKicker,
  leftHeadline,
  leftTagline,
  leftFooter,
  children,
}: {
  leftKicker: string;
  leftHeadline: ReactNode;
  leftTagline: string;
  leftFooter: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper lg:flex lg:min-h-screen">
      {/* Mobile header */}
      <header className="flex justify-center border-b border-line px-6 py-5 lg:hidden">
        <Wordmark size="sm" dark={false} />
      </header>

      {/* Desktop left pane */}
      <div className="hidden bg-ink px-16 py-16 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        <div>
          <p className="mono-label font-mono text-[11px] font-semibold text-red">{leftKicker}</p>
          <h1 className="mt-6 font-display text-[64px] leading-[1.05] font-bold text-paper">
            {leftHeadline}
          </h1>
          <div className="mt-8 h-[3px] w-[46px] bg-red" />
          <p className="mt-8 max-w-sm font-serif text-lg italic text-[#cfc9bd]">{leftTagline}</p>
        </div>
        <p className="mono-label font-mono text-[11px] text-[#8a8377]">{leftFooter}</p>
      </div>

      {/* Form pane */}
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          <div className="hidden lg:block">
            <EstMono />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
