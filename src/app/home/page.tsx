import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getUnit } from "@/lib/units";
import { getCurrentEdition, getEditionMonday, getPulse, getReaderPace } from "@/lib/content";
import { getDayStates } from "@/lib/unlock";
import { Avatar } from "@/components/Avatar";
import { Wordmark } from "@/components/Wordmark";
import { DayGrid } from "@/components/DayGrid";
import { PushNotificationManager } from "@/components/PushNotificationManager";
import { InstallPrompt } from "@/components/InstallPrompt";
import { LogoutButton } from "@/components/LogoutButton";

export default async function HomeBasePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const unit = getUnit(session.unitId);
  const edition = await getCurrentEdition(session.unitId);

  if (!edition) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
        <Wordmark size="md" dark={false} />
        <p className="max-w-sm font-serif text-[15px] text-sub">
          No edition has been published for {unit.name} yet. Run{" "}
          <code className="font-mono text-[13px]">supabase/schema.sql</code> against your project
          to seed one.
        </p>
        <LogoutButton />
      </div>
    );
  }

  const [pace, pulse] = await Promise.all([
    getReaderPace(session.userId, edition.id),
    getPulse(edition.id),
  ]);
  const days = getDayStates(getEditionMonday(edition), pace ?? "daily");
  const monday = getEditionMonday(edition);
  const dateLabel = monday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const fullDateLabel = monday.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const ctaHref = pace ? "/feed" : "/onboarding/pace";
  const mondayLive = days[0].unlocked;

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Desktop left rail (D5) */}
      <aside className="hidden w-[266px] shrink-0 flex-col justify-between bg-ink px-6 py-8 lg:flex">
        <div>
          <Wordmark size="sm" />
          <div className="mt-8 flex flex-col items-start gap-3">
            <Avatar avatarUrl={session.avatarUrl} name={unit.name} size={72} />
            <div>
              <p className="font-display text-lg font-semibold text-paper">{unit.name}</p>
              <p className="font-sans text-[13px] text-[#a49d90]">Revenue Desk</p>
            </div>
          </div>
          <nav className="mt-10 flex flex-col gap-1">
            <Link
              href="/home"
              className="rounded-lg bg-white/10 px-3 py-2.5 font-sans text-sm font-medium text-paper"
            >
              This week&apos;s edition
            </Link>
            <span className="cursor-default rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-[#7a7468]">
              Archive
            </span>
            <Link
              href="/settings"
              className="rounded-lg px-3 py-2.5 font-sans text-sm font-medium text-[#a49d90] hover:bg-white/10 hover:text-paper"
            >
              Settings
            </Link>
          </nav>
        </div>
        <p className="mono-label font-mono text-[11px] text-[#7a7468]">
          Daily reveal · {pace === "weekly" ? "off" : "on"}
        </p>
      </aside>

      <main className="flex-1 px-6 py-10 lg:px-14 lg:py-12">
        {/* Mobile-only header */}
        <div className="flex flex-col items-center text-center lg:hidden">
          <p className="mono-label font-mono text-[11px] font-semibold text-red">Est. 2025</p>
          <span className="mt-3 font-display text-2xl font-bold text-ink">Rev &amp; Research</span>
          <Link href="/settings" className="mt-8">
            <Avatar avatarUrl={session.avatarUrl} name={unit.name} size={158} editBadge="edit" />
          </Link>
          <p className="mono-label mt-5 font-mono text-[11px] text-muted">Managing unit</p>
          <h1 className="mt-1 font-display text-[30px] font-semibold text-ink">{unit.name}</h1>
          <p className="mt-1 font-serif text-[15px] text-sub">Revenue Desk · Week of {dateLabel}</p>

          <Link
            href={ctaHref}
            className="shadow-desktop mt-8 w-full max-w-xs rounded-xl bg-red px-6 py-4 text-center font-sans text-[16px] font-semibold text-white"
          >
            News updates →
          </Link>

          <p className="mt-4 flex items-center gap-2 font-sans text-[13px] text-sub">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: mondayLive ? "#0d6b39" : "#a49d90" }}
            />
            {mondayLive ? "Monday's section is live" : "This week's edition opens Monday"}
          </p>

          <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
            <PushNotificationManager />
            <InstallPrompt />
            <Link
              href="/settings"
              className="rounded-lg border border-line px-4 py-2.5 text-center font-sans text-sm font-medium text-ink hover:bg-warm-1"
            >
              Settings
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Desktop dashboard (D5) */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-green" />
            <p className="font-sans text-sm text-sub">
              {fullDateLabel} · Week {edition.weekNumber} · New section live
            </p>
          </div>
          <h1 className="mt-2 font-display text-[34px] font-semibold text-ink">
            Good morning, {unit.name}
          </h1>
          <p className="mt-1 max-w-xl font-serif text-base text-sub">
            23 homes are news this week — the other ~790 are fine. Read them bit by bit, one part a
            day.
          </p>

          <Link
            href={ctaHref}
            className="mt-8 flex flex-col gap-3 rounded-2xl bg-ink px-8 py-7 transition-transform hover:-translate-y-0.5"
          >
            <p className="kicker">Monday · The Pulse</p>
            <p className="max-w-xl font-display text-2xl font-semibold text-paper">
              {pulse?.headline ?? "This week's edition"}
            </p>
            <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg bg-red px-4 py-2 font-sans text-sm font-semibold text-white">
              Read now →
            </span>
          </Link>

          <p className="mono-label mt-10 font-mono text-[11px] text-muted">This week&apos;s edition</p>
          <div className="mt-3">
            <DayGrid days={days} />
          </div>

          <div className="mt-10 grid max-w-xl gap-3">
            <PushNotificationManager />
            <InstallPrompt />
          </div>
          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </main>
    </div>
  );
}
