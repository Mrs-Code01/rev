"use client";

import { useState } from "react";
import { CallRow } from "./CallRow";
import { Toast } from "./Toast";
import type { SignedCall } from "@/lib/types";

export function SignedCallsPanel({
  editionId,
  calls,
  alreadySent,
  sticky = false,
}: {
  editionId: string;
  calls: SignedCall[];
  alreadySent: boolean;
  sticky?: boolean;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(calls.map((c) => [c.id, c.checkedDefault]))
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(alreadySent);
  const [toast, setToast] = useState<string | null>(null);

  const selectedCalls = calls.filter((c) => checked[c.id]);

  async function handleSend() {
    if (selectedCalls.length === 0 || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editionId,
          calls: selectedCalls.map((c) => ({ home: c.home, action: c.action })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        setToast(`Filed ${selectedCalls.length} call${selectedCalls.length === 1 ? "" : "s"} to #rev-changes-lip`);
      } else {
        setToast(data.error ?? "Couldn't send to Slack.");
      }
    } catch {
      setToast("Couldn't reach Slack.");
    } finally {
      setSending(false);
      setTimeout(() => setToast(null), 3200);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {calls.map((call) => (
          <CallRow
            key={call.id}
            call={call}
            checked={Boolean(checked[call.id])}
            onToggle={() => setChecked((c) => ({ ...c, [call.id]: !c[call.id] }))}
          />
        ))}
      </div>

      <p className="mt-3 font-sans text-[13px] text-muted">
        {selectedCalls.length} of {calls.length} selected
      </p>

      <div className={sticky ? "sticky bottom-4 z-10 mt-2 bg-paper/95 pt-2 backdrop-blur" : "mt-2"}>
        <button
          onClick={handleSend}
          disabled={selectedCalls.length === 0 || sending}
          className="flex w-full items-center justify-center gap-2.5 rounded-[13px] bg-slack px-5 py-4 font-sans text-[15px] font-semibold text-white shadow-desktop disabled:opacity-50"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white font-display text-[13px] font-bold text-slack">
            S
          </span>
          {sending
            ? "Sending…"
            : sent
              ? "Sent — send again → #rev-changes-lip"
              : "Send to team → #rev-changes-lip"}
        </button>
        {sent && (
          <p className="mt-2 text-center font-sans text-[12px] text-muted">
            The RR team files the changes.
          </p>
        )}
      </div>

      <Toast message={toast ?? ""} show={Boolean(toast)} />
    </div>
  );
}
