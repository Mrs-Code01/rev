import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function NotificationPreviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-between px-6 py-10 text-paper"
      style={{ background: "linear-gradient(170deg,#1c3444,#16140f 70%)" }}
    >
      <Link href="/home" className="self-start font-sans text-sm text-[#cfc9bd]">
        ← Back
      </Link>

      <div className="flex flex-col items-center">
        <p className="font-display text-[64px] font-light">7:30</p>
        <p className="-mt-2 font-sans text-lg text-[#cfc9bd]">Tuesday</p>

        <div className="mt-10 w-full max-w-xs rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red font-display text-xs font-bold text-white">
              R
            </span>
            <p className="mono-label font-mono text-[10px] text-[#cfc9bd]">Rev &amp; Research</p>
            <span className="ml-auto font-sans text-[11px] text-[#8a8377]">now</span>
          </div>
          <p className="mt-3 font-sans text-[15px] font-semibold text-paper">
            Tuesday&apos;s section is ready 📰
          </p>
          <p className="mt-1 font-serif text-[13px] text-[#cfc9bd]">
            Fresh Ink: the 3 listings that jumped in demand overnight. Tap to read.
          </p>
        </div>
      </div>

      <p className="mono-label font-mono text-[10px] tracking-[0.3em] text-[#8a8377]">
        Swipe to open
      </p>
    </div>
  );
}
