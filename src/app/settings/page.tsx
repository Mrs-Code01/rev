import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUnit } from "@/lib/units";
import { getCurrentEdition, getReaderPace } from "@/lib/content";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SettingsShell } from "./SettingsShell";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const unit = getUnit(session.unitId);
  const edition = await getCurrentEdition(session.unitId);
  const pace = edition ? await getReaderPace(session.userId, edition.id) : null;

  return (
    <div className="min-h-screen bg-paper px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb back="/home" trail="Settings" />

        <h1 className="mt-6 font-display text-[28px] font-semibold text-ink">Settings</h1>
        <p className="mt-1 font-serif text-[15px] text-sub">{unit.name} · Revenue Desk</p>

        <div className="mt-10">
          <SettingsShell
            displayName={session.displayName}
            avatarUrl={session.avatarUrl}
            unitName={unit.name}
            pace={pace}
            hasEdition={Boolean(edition)}
          />
        </div>
      </div>
    </div>
  );
}
