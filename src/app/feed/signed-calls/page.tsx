import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getCurrentEdition, getSignedCalls, getReaderPace, hasSentToTeam } from "@/lib/content";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SignedCallsPanel } from "@/components/SignedCallsPanel";

export default async function SignedCallsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const edition = await getCurrentEdition(session.unitId);
  if (!edition) redirect("/home");

  const pace = await getReaderPace(session.userId, edition.id);
  if (!pace) redirect("/onboarding/pace");

  const [calls, alreadySent] = await Promise.all([
    getSignedCalls(edition.id),
    hasSentToTeam(edition.id),
  ]);

  return (
    <div className="min-h-screen bg-paper px-6 py-8 pb-28">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb back="/feed" trail="Front Page · Signed Calls" />

        <h1 className="mt-6 font-display text-[28px] font-semibold text-ink">Today&apos;s calls</h1>
        <p className="mt-1 font-serif text-[15px] text-sub">The moves to file with the team.</p>

        <div className="mt-6">
          <SignedCallsPanel editionId={edition.id} calls={calls} alreadySent={alreadySent} sticky />
        </div>
      </div>
    </div>
  );
}
