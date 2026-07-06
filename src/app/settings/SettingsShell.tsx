"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { updateDisplayName, type DisplayNameFormState } from "@/app/actions/settings";
import { PhotoForm } from "@/app/onboarding/photo/PhotoForm";
import { PaceForm } from "@/app/onboarding/pace/PaceForm";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";
import { LogoutButton } from "@/components/LogoutButton";
import type { Pace } from "@/lib/types";

type Tab = "photo" | "pace" | "account";

const TABS: { id: Tab; label: string }[] = [
  { id: "photo", label: "Photo" },
  { id: "pace", label: "Delivery pace" },
  { id: "account", label: "Account" },
];

const initialNameState: DisplayNameFormState = {};

function AccountTab({
  displayName,
  avatarUrl,
  unitName,
}: {
  displayName: string;
  avatarUrl: string | null;
  unitName: string;
}) {
  const [state, formAction, pending] = useActionState(updateDisplayName, initialNameState);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      // Reacting to the action's result (not a plain mount effect), so a
      // timer-driven auto-hide has to live here rather than in an event handler.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToast("Name updated");
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar avatarUrl={avatarUrl} name={unitName} size={48} />
        <p className="font-sans text-[13px] text-muted">Revenue Desk · {unitName}</p>
      </div>

      <form action={formAction} className="mt-6 flex flex-col gap-3">
        <label htmlFor="displayName" className="font-sans text-[13px] font-medium text-sub">
          Your name
        </label>
        <input
          id="displayName"
          name="displayName"
          defaultValue={displayName}
          className="w-full max-w-xs rounded-[10px] border border-line bg-white px-4 py-3 font-serif text-[15px] text-ink focus:border-ink focus:outline-none"
        />
        {state?.error && <p className="font-sans text-sm text-red">{state.error}</p>}
        <Button type="submit" variant="dark" fullWidth={false} disabled={pending} className="w-fit">
          {pending ? "Saving…" : "Save name"}
        </Button>
      </form>

      <div className="mt-10 flex max-w-xs flex-col gap-3 border-t border-line pt-8">
        <Link
          href="/home"
          className="cursor-pointer rounded-lg border border-line px-4 py-2.5 text-center font-sans text-sm font-medium text-ink transition-transform active:scale-[0.98] hover:bg-warm-1"
        >
          Back to home base
        </Link>
        <LogoutButton />
      </div>

      <Toast message={toast ?? ""} show={Boolean(toast)} />
    </div>
  );
}

export function SettingsShell({
  displayName,
  avatarUrl,
  unitName,
  pace,
  hasEdition,
}: {
  displayName: string;
  avatarUrl: string | null;
  unitName: string;
  pace: Pace | null;
  hasEdition: boolean;
}) {
  const [tab, setTab] = useState<Tab>("photo");

  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
      <nav className="flex shrink-0 gap-2 overflow-x-auto sm:w-44 sm:flex-col sm:gap-1 sm:overflow-visible">
        {TABS.map((t) => {
          if (t.id === "pace" && !hasEdition) return null;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`cursor-pointer rounded-lg px-3 py-2.5 text-left font-sans text-sm font-medium whitespace-nowrap transition-colors active:scale-[0.98] ${
                active ? "bg-ink text-paper" : "text-sub hover:bg-warm-1"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1">
        {tab === "photo" && (
          <PhotoForm
            layout="row"
            redirectTo="/settings"
            showSkip={false}
            currentAvatarUrl={avatarUrl}
          />
        )}
        {tab === "pace" && hasEdition && (
          <>
            <p className="mb-2 font-serif text-[14px] text-sub">
              Same edition either way — you choose the pace. Changes apply to this week&apos;s
              edition immediately.
            </p>
            <PaceForm initialPace={pace ?? "daily"} redirectTo="/settings" submitLabel="Save" />
          </>
        )}
        {tab === "account" && (
          <AccountTab displayName={displayName} avatarUrl={avatarUrl} unitName={unitName} />
        )}
      </div>
    </div>
  );
}
