import "server-only";
import { createClient } from "./supabase/server";
import type { Session } from "./types";

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("unit_id, display_name, avatar_url")
    .eq("user_id", user.id)
    .single();
  if (!profile) return null;

  return {
    userId: user.id,
    email: user.email ?? "",
    displayName: profile.display_name,
    unitId: profile.unit_id,
    avatarUrl: profile.avatar_url,
  };
}
