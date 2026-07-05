import { createClient } from "./supabase/server";
import type {
  Edition,
  FlaggedHome,
  FreshInkItem,
  MarginReadBody,
  PulseBody,
  SignedCall,
} from "./types";

// Fixed sample copy straight from spec §8: "23 homes are news this week" /
// "silence = the other ~790 are fine" (~800 homes under management, not a
// strict subtraction).
export const TOTAL_HOME_COUNT = 800;
export const SILENT_HOME_COUNT = 790;

export async function getCurrentEdition(unitId: string): Promise<Edition | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("editions")
    .select("id, unit_id, week_number, published_at")
    .eq("unit_id", unitId)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    id: data.id,
    unitId: data.unit_id,
    weekNumber: data.week_number,
    publishedAt: data.published_at,
  };
}

export function getEditionMonday(edition: Edition): Date {
  return new Date(edition.publishedAt);
}

export async function getFlaggedHomes(editionId: string): Promise<FlaggedHome[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("flagged_homes")
    .select("id, edition_id, address, bedrooms, problem, verdict")
    .eq("edition_id", editionId);

  return (data ?? []).map((h) => ({
    id: h.id,
    editionId: h.edition_id,
    address: h.address,
    bedrooms: h.bedrooms,
    problem: h.problem,
    verdict: h.verdict,
  }));
}

export async function getSignedCalls(editionId: string): Promise<SignedCall[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("signed_calls")
    .select("id, edition_id, home, action, est_value, checked_default")
    .eq("edition_id", editionId);

  return (data ?? []).map((c) => ({
    id: c.id,
    editionId: c.edition_id,
    home: c.home,
    action: c.action,
    estValue: c.est_value ?? "—",
    checkedDefault: c.checked_default,
  }));
}

async function getSectionBody(editionId: string, key: string): Promise<unknown> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sections")
    .select("body_json")
    .eq("edition_id", editionId)
    .eq("key", key)
    .maybeSingle();
  return data?.body_json ?? null;
}

export async function getPulse(editionId: string): Promise<PulseBody | null> {
  const body = await getSectionBody(editionId, "pulse");
  return (body as PulseBody) ?? null;
}

export async function getFreshInk(editionId: string): Promise<FreshInkItem[]> {
  const body = (await getSectionBody(editionId, "fresh_ink")) as { items?: FreshInkItem[] } | null;
  return body?.items ?? [];
}

export async function getMarginRead(editionId: string): Promise<MarginReadBody | null> {
  const body = await getSectionBody(editionId, "margin_read");
  return (body as MarginReadBody) ?? null;
}

export async function getReaderPace(userId: string, editionId: string): Promise<"daily" | "weekly" | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reader_prefs")
    .select("pace")
    .eq("user_id", userId)
    .eq("edition_id", editionId)
    .maybeSingle();
  return data?.pace ?? null;
}

export async function hasSentToTeam(editionId: string): Promise<boolean> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("slack_sends")
    .select("id", { count: "exact", head: true })
    .eq("edition_id", editionId);
  return Boolean(count && count > 0);
}
