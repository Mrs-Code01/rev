import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for Server Components, Server Actions, and
 * Route Handlers. Reads/writes the session via Next's cookies() API.
 *
 * Writing cookies from a Server Component throws (Next.js only allows cookie
 * writes from Server Actions/Route Handlers) -- that's caught and ignored
 * below because `proxy.ts` refreshes the session on every request anyway.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render; proxy.ts refreshes sessions instead.
          }
        },
      },
    }
  );
}
