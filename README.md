# Rev & Research

A mobile-first, installable PWA for revenue managers: a weekly newspaper edition
revealed Mon–Wed, built around an "exceptions feed" instead of a data grid.
Built to the Phase 1 spec in [`BUILD_PROMPT.md`](./BUILD_PROMPT.md).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to the splash screen, then to
sign-up/login. Create an account (any email/password), and you're in.

## What's real vs. demo right now

This runs **today, with zero setup**, against an in-memory data layer that
mirrors the Supabase schema in [`supabase/schema.sql`](./supabase/schema.sql)
exactly — same tables, same columns, same sample content from spec §8. That
was a deliberate Phase 1 choice (no Supabase project existed yet) so every
screen is clickable and demoable immediately. Concretely:

| Feature | Right now | Once you go live |
|---|---|---|
| Accounts / sessions | In-memory user store + httpOnly cookie session | Supabase Auth |
| Edition/section/home/call data | Deterministic mock data (`src/lib/content.ts`) | Postgres via `supabase/schema.sql` |
| Avatar upload | Stored as a data: URL in memory | Supabase Storage |
| Slack "Send to team" | **Real** — posts to an Incoming Webhook if `SLACK_WEBHOOK_URL` is set, otherwise logs the payload to the server console | same, just set the env var |
| Web push | **Real** — service worker + VAPID, if `NEXT_PUBLIC_VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` are set | same, just set the env vars |
| PWA (manifest, icons, offline shell) | **Real**, no setup needed | same |

The in-memory store resets on server restart — that's expected. All the
mutable bits (`src/lib/store.ts`) are written with Supabase-shaped function
signatures so swapping them for real queries is mechanical, not a rewrite.

## Going live with Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Paste the contents of `supabase/schema.sql` into the SQL editor and run it.
   It creates all 8 tables from spec §9, enables RLS scoped to the RM's own
   unit, and seeds one live "Life in Paradise" edition with the sample copy
   from spec §8.
3. Copy `.env.local.example` to `.env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` /
   `SUPABASE_SERVICE_ROLE_KEY`.
4. Replace the functions in `src/lib/store.ts` and `src/lib/content.ts` with
   Supabase queries (`@supabase/supabase-js` and `@supabase/ssr` are already
   installed) and swap `src/lib/session.ts` for `supabase.auth`.

## Other integrations

- **Slack**: create an [Incoming Webhook](https://api.slack.com/messaging/webhooks)
  pointed at `#rev-changes-lip` and set `SLACK_WEBHOOK_URL`. Until then, sends
  are logged to the server console and still recorded as "sent" in-app so the
  UI is fully testable.
- **Web push**: run `npx web-push generate-vapid-keys` and set
  `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`. Enable it from the
  Home base screen ("Daily push").

## Known Phase 1 simplifications

- Every unit reads the same edition content (§2 only requires units be
  *selectable*, not each have distinct seeded data yet).
- Avatar "crop to circle" is CSS (`object-fit: cover` in a circle mask), not
  an interactive crop editor.
- "See all 23" in Mug Shots expands in place; it does not open the (Phase 2+)
  Reading Room, which is intentionally not built.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · Supabase
(ready, not yet connected) · `web-push` · Route Handlers + Server Actions ·
`proxy.ts` for auth gating (Next 16 renamed `middleware.ts` → `proxy.ts`).
