"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getCurrentEdition } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import type { Pace } from "@/lib/types";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export interface AvatarFormState {
  error?: string;
}

export async function uploadAvatar(
  _prevState: AvatarFormState,
  formData: FormData
): Promise<AvatarFormState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image first." };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { error: "Images must be under 5MB." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "That file isn't an image." };
  }

  const supabase = await createClient();
  const ext = file.type.split("/")[1] ?? "jpg";
  const path = `${session.userId}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: `${publicUrl}?v=${Date.now()}` })
    .eq("user_id", session.userId);
  if (profileError) {
    return { error: profileError.message };
  }

  redirect(String(formData.get("redirectTo") ?? "/home"));
}

export async function skipAvatar(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(String(formData.get("redirectTo") ?? "/home"));
}

export async function choosePace(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const pace = (formData.get("pace") === "weekly" ? "weekly" : "daily") as Pace;
  const edition = await getCurrentEdition(session.unitId);
  if (!edition) redirect("/home");

  const supabase = await createClient();
  await supabase
    .from("reader_prefs")
    .upsert({ user_id: session.userId, edition_id: edition.id, pace });

  redirect(String(formData.get("redirectTo") ?? "/feed"));
}
