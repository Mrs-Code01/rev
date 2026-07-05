import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getCurrentEdition } from "@/lib/content";
import { getUnit } from "@/lib/units";
import { PaceForm } from "./PaceForm";

export default async function DeliveryPacePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const unit = getUnit(session.unitId);
  const edition = await getCurrentEdition(session.unitId);
  if (!edition) redirect("/home");

  return (
    <div className="min-h-screen bg-paper px-6 py-12 lg:flex lg:items-center lg:justify-center">
      <div className="mx-auto max-w-md lg:max-w-2xl">
        <p className="mono-label text-center font-mono text-[11px] text-muted lg:text-left">
          {unit.name} · Week {edition.weekNumber}
        </p>
        <h1 className="mt-3 text-center font-display text-[32px] font-semibold text-ink lg:text-left lg:text-[40px]">
          How should we deliver this week?
        </h1>
        <p className="mt-2 text-center font-serif text-[15px] text-sub lg:text-left">
          Same edition either way — you choose the pace.
        </p>

        <PaceForm />
      </div>
    </div>
  );
}
