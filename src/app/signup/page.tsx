import Link from "next/link";
import { AuthSplit } from "@/components/AuthSplit";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <AuthSplit
      leftKicker="Join the desk"
      leftHeadline={
        <>
          One paper.
          <br />
          Your unit.
        </>
      }
      leftTagline="Pick the unit you manage — every edition is written for it."
      leftFooter="13 UNITS · REVENUE DESK"
    >
      <h1 className="mt-4 font-display text-[25px] font-semibold text-ink">Create your account</h1>
      <p className="mt-1 font-serif text-[15px] text-sub">Select the unit you manage.</p>

      <SignupForm />

      <p className="mt-6 text-center font-sans text-sm text-sub">
        Already have one?{" "}
        <Link href="/login" className="font-medium text-blue">
          Log in
        </Link>
      </p>
    </AuthSplit>
  );
}
