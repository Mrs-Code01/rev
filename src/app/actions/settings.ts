"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export interface DisplayNameFormState {
  error?: string;
  success?: boolean;
}

export async function updateDisplayName(
  _prevState: DisplayNameFormState,
  formData: FormData
): Promise<DisplayNameFormState> {
  const session = await getSession();
  if (!session) return { error: "Not signed in." };

  const displayName = String(formData.get("displayName") ?? "").trim();
  if (displayName.length < 2) {
    return { error: "Name must be at least 2 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("user_id", session.userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/home");
  return { success: true };
}
