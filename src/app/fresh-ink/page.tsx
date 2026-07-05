import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getCurrentEdition, getEditionMonday, getFreshInk, getReaderPace } from "@/lib/content";
import { getDayStates } from "@/lib/unlock";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Kicker } from "@/components/Kicker";
import { LockedSection } from "@/components/LockedSection";
import type { FreshInkItem } from "@/lib/types";

const STATUS_COLOR: Record<FreshInkItem["status"], string> = {
  recovered: "#0d6b39",
  soft: "#c0341d",
  new: "#b07a17",
};

export default async function FreshInkPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const edition = await getCurrentEdition(session.unitId);
  if (!edition) redirect("/home");

  const pace = await getReaderPace(session.userId, edition.id);
  if (!pace) redirect("/onboarding/pace");

  const days = getDayStates(getEditionMonday(edition), pace);
  const tuesday = days[1];
  const wednesday = days[2];
  const items = await getFreshInk(edition.id);

  return (
    <div className="min-h-screen bg-paper px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb back="/feed" trail="Tuesday · Fresh Ink" />

        <Kicker className="mt-6">What flipped overnight</Kicker>
        <h1 className="mt-1 font-display text-[30px] font-semibold text-ink">Fresh Ink</h1>

        <div className="mt-8">
          {tuesday.unlocked ? (
            <>
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.home} className="rounded-xl border border-card-line bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display text-base font-semibold text-ink">
                        {item.home} · {item.bedrooms}BR
                      </p>
                      <span
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold"
                        style={{
                          color: STATUS_COLOR[item.status],
                          backgroundColor: `${STATUS_COLOR[item.status]}1a`,
                        }}
                      >
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: STATUS_COLOR[item.status] }}
                        />
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-1 font-serif text-[14px] text-sub">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-line pt-5">
                <p className="font-mono text-[11px] tracking-wide text-muted uppercase">
                  Tuesday · {items.length} changes
                </p>
                {wednesday.unlocked ? (
                  <Link
                    href="/margin-read"
                    className="rounded-lg bg-ink px-5 py-3 font-sans text-sm font-semibold text-paper"
                  >
                    Wed →
                  </Link>
                ) : (
                  <span className="rounded-lg bg-warm-1 px-5 py-3 font-sans text-sm font-medium text-faint">
                    🔒 Wed
                  </span>
                )}
              </div>
            </>
          ) : (
            <LockedSection dayName="Tue" timeLabel={`in ${tuesday.countdownLabel}`} />
          )}
        </div>
      </div>
    </div>
  );
}
