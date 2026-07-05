"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeUser, unsubscribeUser, sendNotification } from "@/app/actions/push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      // Feature-detection that can only run client-side; mirrors the pattern
      // in Next.js's own PWA guide (next/dist/docs/.../progressive-web-apps.md).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupported(true);
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then(setSubscription);
      });
    }
  }, []);

  async function subscribeToPush() {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;
    setPending(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      setSubscription(sub);
      await subscribeUser(JSON.parse(JSON.stringify(sub)));
    } finally {
      setPending(false);
    }
  }

  async function unsubscribeFromPush() {
    setPending(true);
    try {
      await subscription?.unsubscribe();
      setSubscription(null);
      await unsubscribeUser();
    } finally {
      setPending(false);
    }
  }

  async function sendTestNotification() {
    setPending(true);
    try {
      await sendNotification(
        "Tuesday's section is ready 📰",
        "Fresh Ink: the 3 listings that jumped in demand overnight. Tap to read.",
        "/fresh-ink"
      );
    } finally {
      setPending(false);
    }
  }

  if (!isSupported) return null;

  const vapidConfigured = Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-card-line bg-white px-4 py-3">
      <div>
        <p className="font-sans text-sm font-semibold text-ink">Daily push</p>
        <p className="font-sans text-[13px] text-muted">
          {subscription ? "Enabled on this device" : "Off — enable to get notified on unlock"}
        </p>
        <Link href="/notification-preview" className="font-sans text-[12px] font-medium text-blue">
          See what it looks like →
        </Link>
      </div>
      {!vapidConfigured ? (
        <span className="font-mono text-[11px] text-faint">not configured</span>
      ) : subscription ? (
        <div className="flex gap-2">
          <button
            onClick={sendTestNotification}
            disabled={pending}
            className="rounded-lg border border-line px-3 py-2 font-sans text-[13px] font-medium text-ink"
          >
            Send test
          </button>
          <button
            onClick={unsubscribeFromPush}
            disabled={pending}
            className="rounded-lg border border-line px-3 py-2 font-sans text-[13px] font-medium text-sub"
          >
            Turn off
          </button>
        </div>
      ) : (
        <button
          onClick={subscribeToPush}
          disabled={pending}
          className="rounded-lg bg-ink px-3 py-2 font-sans text-[13px] font-medium text-paper"
        >
          Enable
        </button>
      )}
    </div>
  );
}
