import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full rounded-lg border border-line px-4 py-2.5 font-sans text-sm font-medium text-sub hover:bg-warm-1"
      >
        Log out
      </button>
    </form>
  );
}
