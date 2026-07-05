import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getCurrentEdition, getPulse, getReaderPace } from "@/lib/content";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Kicker } from "@/components/Kicker";
import { VerdictPill } from "@/components/VerdictPill";

export default async function PulsePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const edition = await getCurrentEdition(session.unitId);
  if (!edition) redirect("/home");

  const pace = await getReaderPace(session.userId, edition.id);
  if (!pace) redirect("/onboarding/pace");

  const pulse = await getPulse(edition.id);
  if (!pulse) redirect("/feed");

  return (
    <div className="min-h-screen bg-paper px-6 py-8 lg:px-0">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb back="/feed" trail="Front Page · The Pulse" />

        <div className="mt-8">
          <Kicker>The one number</Kicker>
          <p className="mt-3 font-display text-[52px] leading-none font-bold text-ink sm:text-[62px]">
            {pulse.number}
          </p>
          <p className="mt-5 font-serif text-[17px] leading-relaxed text-ink">{pulse.paragraph}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {pulse.verdicts.map((v) => (
              <VerdictPill key={v.label} verdict={v.verdict} label={v.label} />
            ))}
          </div>

          <blockquote className="mt-8 border-l-2 border-red pl-5 font-serif text-lg italic text-sub">
            &ldquo;{pulse.pullQuote}&rdquo;
          </blockquote>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-line pt-5">
          <p className="font-mono text-[11px] tracking-wide text-muted uppercase">
            1 of 3 on the Front Page
          </p>
          <Link
            href="/feed/signed-calls"
            className="rounded-lg bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper"
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}
