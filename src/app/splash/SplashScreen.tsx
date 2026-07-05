"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { EstMono, Wordmark } from "@/components/Wordmark";

export function SplashScreen({ nextHref }: { nextHref: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace(nextHref), 1700);
    return () => clearTimeout(timer);
  }, [nextHref, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <EstMono />
      <div className="mt-4">
        <Wordmark size="lg" />
      </div>
      <div className="mt-6 h-[2px] w-[38px] bg-red" />
      <p className="mt-8 max-w-xs font-serif text-[17px] italic text-[#cfc9bd]">
        The numbers behind every night booked.
      </p>

      <div className="fixed bottom-16 flex w-[170px] flex-col items-center gap-3">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/14">
          <div className="loading-bar-fill h-full w-1/3 rounded-full bg-red" />
        </div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#8a8377] uppercase">
          Preparing this week&apos;s edition
        </p>
      </div>
    </div>
  );
}
