import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getCurrentEdition, getEditionMonday, getMarginRead, getReaderPace } from "@/lib/content";
import { getDayStates } from "@/lib/unlock";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Kicker } from "@/components/Kicker";
import { LockedSection } from "@/components/LockedSection";

export default async function MarginReadPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const edition = await getCurrentEdition(session.unitId);
  if (!edition) redirect("/home");

  const pace = await getReaderPace(session.userId, edition.id);
  if (!pace) redirect("/onboarding/pace");

  const days = getDayStates(getEditionMonday(edition), pace);
  const wednesday = days[2];
  const marginRead = await getMarginRead(edition.id);
  if (!marginRead) redirect("/feed");

  return (
    <div className="min-h-screen bg-paper px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb back="/feed" trail="Wednesday · The Margin Read" />

        <Kicker className="mt-6">Wednesday</Kicker>
        <h1 className="mt-1 font-display text-[30px] font-semibold text-ink">{marginRead.headline}</h1>

        <div className="mt-8">
          {wednesday.unlocked ? (
            <div className="flex flex-col gap-5">
              {marginRead.paragraphs.map((p, i) => (
                <p key={i} className="font-serif text-[16px] leading-relaxed text-ink">
                  {p}
                </p>
              ))}

              <div className="stripe-placeholder flex h-40 items-center justify-center rounded-xl">
                <span className="mono-label font-mono text-[11px] text-muted">
                  {marginRead.chartLabel}
                </span>
              </div>

              <div className="rounded-xl border border-line bg-warm-2 p-5">
                <p className="mono-label font-mono text-[10.5px] font-semibold text-red">Takeaway</p>
                <p className="mt-2 font-serif text-[15px] text-ink">{marginRead.takeaway}</p>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-line pt-5">
                <p className="font-mono text-[11px] tracking-wide text-muted uppercase">
                  Wednesday · closes the week
                </p>
                <Link
                  href="/home"
                  className="rounded-lg bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper"
                >
                  Done ✓
                </Link>
              </div>
            </div>
          ) : (
            <LockedSection dayName="Wed" timeLabel={`in ${wednesday.countdownLabel}`} />
          )}
        </div>
      </div>
    </div>
  );
}
