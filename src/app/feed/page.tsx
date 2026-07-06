import { redirect } from "next/navigation";
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

  const [pace, homes, calls, pulse, alreadySent] = await Promise.all([
    getReaderPace(session.userId, edition.id),
    getFlaggedHomes(edition.id),
    getSignedCalls(edition.id),
    getPulse(edition.id),
    hasSentToTeam(edition.id),
  ]);
  if (!pace) redirect("/onboarding/pace");
  if (!pulse) redirect("/home");

  const days = getDayStates(getEditionMonday(edition), pace);
  const monday = getEditionMonday(edition);
  const dateLabel = monday.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const flaggedCount = homes.length;

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
        <Masthead unitName={unit.name} weekNumber={edition.weekNumber} dateLabel={dateLabel} />

        <div className="mt-6">
          <DayTabs days={days} activeDay={1} />
        </div>

        {/* Front Page — same content at every breakpoint, layout reflows for width */}
        <div className="mt-6 lg:mt-10">
          <Kicker>The Front Page · The Pulse</Kicker>
          <h2 className="mt-2 max-w-4xl font-display text-[30px] leading-[1.1] font-bold text-ink lg:text-[46px] lg:leading-[1.05]">
            {pulse.headline}
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-base italic text-sub lg:text-lg">
            {pulse.paragraph}
          </p>

          <div className="mt-8 rounded-xl bg-warm-1 px-4 py-3 text-center lg:hidden">
            <p className="font-mono text-sm font-semibold text-ink">
              {flaggedCount} homes are news this week
            </p>
            <p className="mt-0.5 font-sans text-[13px] text-muted">
              silence = the other ~{SILENT_HOME_COUNT} are fine
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col gap-4 font-serif text-[15px] leading-relaxed text-ink lg:col-span-2 min-[900px]:block min-[900px]:columns-2 min-[900px]:gap-8 min-[900px]:[text-align:justify]">
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

            <aside className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pt-0 lg:pl-8">
              <Kicker>The Pulse</Kicker>
              <p className="mt-2 font-display text-[48px] leading-none font-bold text-ink lg:text-[64px]">
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

          <div className="mt-10 grid grid-cols-1 gap-8 border-t border-line pt-8 lg:mt-14 lg:grid-cols-2 lg:gap-12 lg:pt-10">
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
