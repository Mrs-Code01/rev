"use client";

import { useActionState } from "react";
import { login, type AuthFormState } from "@/app/actions/auth";
import { TextField } from "@/components/TextField";
import { Button } from "@/components/Button";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <TextField label="Email" name="email" type="email" placeholder="you@company.com" required />
      <TextField label="Password" name="password" type="password" placeholder="••••••••" required />
      {state?.error && <p className="font-sans text-sm text-red">{state.error}</p>}
      <a href="#" className="-mt-2 font-sans text-sm font-medium text-blue">
        Forgot password?
      </a>
      <Button type="submit" variant="dark" disabled={pending}>
        {pending ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}
