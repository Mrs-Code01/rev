import Link from "next/link";
import { AuthSplit } from "@/components/AuthSplit";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthSplit
      leftKicker="Est. 2025"
      leftHeadline={<>Rev &amp; Research</>}
      leftTagline="The numbers behind every night booked."
      leftFooter="13 UNITS · ONE WEEKLY EDITION · REVEALED DAILY"
    >
      <h1 className="mt-4 font-display text-[30px] font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 font-serif text-[15px] text-sub">
        Life in Paradise — sign in to today&apos;s edition.
      </p>

      <LoginForm />

      <p className="mt-6 text-center font-sans text-sm text-sub">
        New here?{" "}
        <Link href="/signup" className="font-medium text-blue">
          Create an account
        </Link>
      </p>
    </AuthSplit>
  );
}
