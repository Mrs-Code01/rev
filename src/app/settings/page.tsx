import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getUnit } from "@/lib/units";
import { getCurrentEdition, getReaderPace } from "@/lib/content";
import { Avatar } from "@/components/Avatar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Kicker } from "@/components/Kicker";
import { PhotoForm } from "@/app/onboarding/photo/PhotoForm";
import { PaceForm } from "@/app/onboarding/pace/PaceForm";
import { LogoutButton } from "@/components/LogoutButton";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const unit = getUnit(session.unitId);
  const edition = await getCurrentEdition(session.unitId);
  const pace = edition ? await getReaderPace(session.userId, edition.id) : null;

  return (
    <div className="min-h-screen bg-paper px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb back="/home" trail="Settings" />

        <h1 className="mt-6 font-display text-[28px] font-semibold text-ink">Settings</h1>
        <p className="mt-1 font-serif text-[15px] text-sub">{unit.name} · Revenue Desk</p>

        <section className="mt-10">
          <Kicker>Photo</Kicker>
          <div className="mt-4">
            <PhotoForm redirectTo="/settings" showSkip={false} currentAvatarUrl={session.avatarUrl} />
          </div>
        </section>

        {edition && (
          <section className="mt-12 border-t border-line pt-10">
            <Kicker>Delivery pace</Kicker>
            <p className="mt-1 font-serif text-[15px] text-sub">
              Same edition either way — you choose the pace. Changes apply to this week&apos;s
              edition immediately.
            </p>
            <PaceForm
              initialPace={pace ?? "daily"}
              redirectTo="/settings"
              submitLabel="Save"
            />
          </section>
        )}

        <section className="mt-12 border-t border-line pt-10">
          <Kicker>Account</Kicker>
          <div className="mt-4 flex items-center gap-3">
            <Avatar avatarUrl={session.avatarUrl} name={unit.name} size={48} />
            <div>
              <p className="font-sans text-sm font-semibold text-ink">{session.displayName}</p>
              <p className="font-sans text-[13px] text-muted">{session.email}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/home"
              className="rounded-lg border border-line px-4 py-2.5 text-center font-sans text-sm font-medium text-ink hover:bg-warm-1"
            >
              Back to home base
            </Link>
            <LogoutButton />
          </div>
        </section>
      </div>
    </div>
  );
}
