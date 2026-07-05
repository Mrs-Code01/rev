"use server";

import webpush from "web-push";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export interface PushSubscriptionJSON {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_CONFIGURED = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);

if (VAPID_CONFIGURED) {
  webpush.setVapidDetails("mailto:hello@revandresearch.app", VAPID_PUBLIC_KEY!, VAPID_PRIVATE_KEY!);
}

export async function subscribeUser(sub: PushSubscriptionJSON): Promise<{ success: boolean }> {
  const session = await getSession();
  if (!session) return { success: false };

  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").upsert({
    user_id: session.userId,
    endpoint: sub.endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
  });
  return { success: !error };
}

export async function unsubscribeUser(): Promise<{ success: boolean }> {
  const session = await getSession();
  if (!session) return { success: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", session.userId);
  return { success: !error };
}

/** Fires the P12 "next day unlocked" push. Falls back to a console log in dev when VAPID keys aren't set. */
export async function sendNotification(
  title: string,
  body: string,
  url: string = "/"
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not signed in." };

  const supabase = await createClient();
  const { data: sub } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", session.userId)
    .maybeSingle();
  if (!sub) return { success: false, error: "No subscription on file." };

  if (!VAPID_CONFIGURED) {
    console.log("[push:dry-run] VAPID keys not set. Would have sent:", { title, body, url });
    return { success: true };
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      } as webpush.PushSubscription,
      JSON.stringify({ title, body, url, icon: "/icons/icon-192.png" })
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
