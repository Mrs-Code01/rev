"use client";

import { useActionState } from "react";
import { signup, type AuthFormState } from "@/app/actions/auth";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";
import { UnitPicker } from "./UnitPicker";

const initialState: AuthFormState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <UnitPicker />
      <TextField label="Name" name="displayName" placeholder="Your name" required />
      <TextField label="Email" name="email" type="email" placeholder="you@company.com" required />
      <TextField label="Password" name="password" type="password" placeholder="••••••••" required minLength={8} />
      {state?.error && <p className="font-sans text-sm text-red">{state.error}</p>}
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
