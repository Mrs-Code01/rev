import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getUnit } from "@/lib/units";
import {
  getCurrentEdition,
  getEditionMonday,
  getFlaggedHomes,
  getSignedCalls,
  getPulse,
  getReaderPace,
  hasSentToTeam,
  SILENT_HOME_COUNT,
} from "@/lib/content";
import { getDayStates } from "@/lib/unlock";
import { DayTabs } from "@/components/DayTabs";
import { Masthead } from "@/components/Masthead";
import { Kicker } from "@/components/Kicker";
import { MugShots } from "@/components/MugShots";
import { VerdictPill } from "@/components/VerdictPill";
import { SignedCallsPanel } from "@/components/SignedCallsPanel";

export default async function FrontPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const unit = getUnit(session.unitId);
  const edition = await getCurrentEdition(session.unitId);
  if (!edition) redirect("/home");

  const pace = await getReaderPace(session.userId, edition.id);
  if (!pace) redirect("/onboarding/pace");

  const days = getDayStates(getEditionMonday(edition), pace);
  const monday = getEditionMonday(edition);
  const dateLabel = monday.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const [homes, calls, pulse, alreadySent] = await Promise.all([
    getFlaggedHomes(edition.id),
    getSignedCalls(edition.id),
    getPulse(edition.id),
    hasSentToTeam(edition.id),
  ]);
  if (!pulse) redirect("/home");

  const flaggedCount = homes.length;

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
        <Masthead unitName={unit.name} weekNumber={edition.weekNumber} dateLabel={dateLabel} />

        <div className="mt-6">
          <DayTabs days={days} activeDay={1} />
        </div>

        {/* Mobile feed (P7) */}
        <div className="mt-6 flex flex-col gap-8 lg:hidden">
          <Link href="/feed/pulse" className="block rounded-2xl border border-card-line bg-white p-5">
            <Kicker>Monday · The Pulse</Kicker>
            <p className="mt-2 font-display text-[40px] font-bold text-ink">{pulse.number}</p>
            <p className="mt-1 font-serif text-[15px] text-sub">{pulse.paragraph}</p>
          </Link>

          <div className="rounded-xl bg-warm-1 px-4 py-3 text-center">
            <p className="font-mono text-sm font-semibold text-ink">
              {flaggedCount} homes are news this week
            </p>
            <p className="mt-0.5 font-sans text-[13px] text-muted">
              silence = the other ~{SILENT_HOME_COUNT} are fine
            </p>
          </div>

          <MugShots homes={homes} totalCount={flaggedCount} />

          <Link
            href="/feed/signed-calls"
            className="flex items-center justify-between rounded-xl border border-card-line bg-white px-5 py-4"
          >
            <span className="font-display text-lg font-semibold text-ink">
              {calls.filter((c) => c.checkedDefault).length} calls to make today
            </span>
            <span className="text-ink">→</span>
          </Link>
        </div>

        {/* Desktop broadsheet (D6) */}
        <div className="mt-10 hidden lg:block">
          <Kicker>The Front Page · The Pulse</Kicker>
          <h2 className="mt-2 max-w-4xl font-display text-[46px] leading-[1.05] font-bold text-ink">
            {pulse.headline}
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-lg italic text-sub">{pulse.paragraph}</p>

          <div className="mt-10 grid grid-cols-3 gap-12">
            <div className="col-span-2 columns-2 gap-8 font-serif text-[15px] leading-relaxed text-ink [text-align:justify]">
              <p>
                <span className="float-left mr-2 font-display text-[64px] leading-[0.8] font-bold text-ink">
                  T
                </span>
                he calendar looks healthy at a glance: weekends are essentially sold out across the
                portfolio, and the topline number keeps climbing quarter over quarter. But the
                exceptions engine reads all 800 homes every week, not just the ones that are easy to
                check — and this week it flagged a pattern hiding in plain sight.
              </p>
              <p className="mt-4">
                {pulse.paragraph} The homes carrying this gap aren&apos;t underperforming on
                weekends — they&apos;re fully priced for Friday and Saturday. The shortfall lives
                entirely in Tuesday and Wednesday nights that were priced once, in January, and
                never touched again.
              </p>
              <p className="mt-4">
                Fixing it doesn&apos;t mean discounting the weekend. It means moving the floor on
                the nights that are actually soft, which is exactly what today&apos;s Signed Calls
                do.
              </p>
            </div>

            <aside className="border-l border-line pl-8">
              <Kicker>The Pulse</Kicker>
              <p className="mt-2 font-display text-[64px] leading-none font-bold text-ink">
                {pulse.number}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {pulse.verdicts.map((v) => (
                  <VerdictPill key={v.label} verdict={v.verdict} label={v.label} />
                ))}
              </div>
              <blockquote className="mt-6 border-l-2 border-red pl-4 font-serif text-base italic text-sub">
                &ldquo;{pulse.pullQuote}&rdquo;
              </blockquote>
            </aside>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-12 border-t border-line pt-10">
            <MugShots homes={homes} totalCount={flaggedCount} />

            <section>
              <Kicker>Signed Calls · Today&apos;s calls</Kicker>
              <p className="mt-2 font-serif text-sm text-sub">The moves to file with the team.</p>
              <div className="mt-3">
                <SignedCallsPanel editionId={edition.id} calls={calls} alreadySent={alreadySent} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
