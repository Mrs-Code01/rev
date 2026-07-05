"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_UNIT_ID } from "@/lib/units";

export interface AuthFormState {
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const unitId = String(formData.get("unitId") ?? DEFAULT_UNIT_ID);

  if (displayName.length < 2) {
    return { error: "Enter your name." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Enter a valid email." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { error: error.message };
  }
  if (!data.user) {
    return { error: "Check your inbox to confirm your email, then log in." };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    user_id: data.user.id,
    unit_id: unitId,
    display_name: displayName,
  });
  if (profileError) {
    return { error: profileError.message };
  }

  redirect("/onboarding/photo");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "That email and password don't match." };
  }

  redirect("/home");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
