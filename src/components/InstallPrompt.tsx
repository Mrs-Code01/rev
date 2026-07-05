"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Feature-detection that can only run client-side; mirrors the pattern in
    // Next.js's own PWA guide (next/dist/docs/.../progressive-web-apps.md).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone) return null;
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-card-line bg-white px-4 py-3">
      <div>
        <p className="font-sans text-sm font-semibold text-ink">Install Rev &amp; Research</p>
        {isIOS ? (
          <p className="font-sans text-[13px] text-muted">
            Tap the share icon ⎋ then &ldquo;Add to Home Screen&rdquo; ➕
          </p>
        ) : (
          <p className="font-sans text-[13px] text-muted">Add it to your home screen for one-tap access.</p>
        )}
      </div>
      {!isIOS && deferredPrompt && (
        <button
          onClick={async () => {
            await deferredPrompt.prompt();
            setDeferredPrompt(null);
          }}
          className="shrink-0 rounded-lg bg-ink px-3 py-2 font-sans text-[13px] font-medium text-paper"
        >
          Add
        </button>
      )}
    </div>
  );
}
