import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import { getUnit } from "@/lib/units";

const SLACK_CHANNEL = "#rev-changes-lip";

interface SendBody {
  editionId: string;
  calls: { home: string; action: string }[];
}

/**
 * The ONLY Slack integration in this app. Internal-only: files the RM's
 * selected rate-change calls to the revenue team's channel. Never contacts
 * homeowners and never posts anywhere else.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = (await request.json()) as SendBody;
  if (!body.calls?.length) {
    return NextResponse.json({ error: "Select at least one call." }, { status: 400 });
  }

  const unit = getUnit(session.unitId);
  const lines = body.calls.map((c) => `• *${c.home}* — ${c.action}`).join("\n");
  const payload = {
    channel: SLACK_CHANNEL,
    username: "Rev & Research",
    icon_emoji: ":newspaper:",
    text: `*${unit.name}* · ${session.displayName} filed ${body.calls.length} call${
      body.calls.length === 1 ? "" : "s"
    } for the team:\n${lines}`,
  };

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: `Slack webhook responded ${res.status}` },
          { status: 502 }
        );
      }
    } catch {
      return NextResponse.json({ error: "Could not reach Slack." }, { status: 502 });
    }
  } else {
    console.log("[slack:dry-run] SLACK_WEBHOOK_URL not set. Would have posted:", payload);
  }

  const supabase = await createClient();
  await supabase.from("slack_sends").insert({
    unit_id: session.unitId,
    edition_id: body.editionId,
    channel: SLACK_CHANNEL,
    payload_json: payload,
  });

  return NextResponse.json({ ok: true, channel: SLACK_CHANNEL, count: body.calls.length });
}
