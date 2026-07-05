# Build Prompt — Rev & Research PWA · PHASE 1

> Paste this whole document into Antigravity as the build spec. It obeys THE_ROADMAP: build ONLY the five ready Phase-1 sections, the exceptions home screen, and internal Slack. Nothing blocked or later-phase.

---

## 0. What you are building
A **mobile-first, installable PWA** called **Rev & Research** — a digital newspaper for property-management companies. Used by the **revenue manager (RM)** at any of **13 property-management "units."** One **weekly edition** is published and revealed **one day at a time, Monday – Wednesday** (Phase 1 is a 3-day drip). The RM logs in once per device, lands on a personal home base, opens the **exceptions feed** — the ~15–40 homes that are *news* this week — reads that day's section(s), gets a daily push when the next day unlocks, and files flagged units to the **internal team via Slack**. It must be a real PWA: installable, custom icon, offline shell, web-push.

**Stack:** Next.js (App Router) + TypeScript + Tailwind + Supabase (auth + Postgres + storage), `next-pwa`, deployed to Vercel. Login-gated. Slack via an **Incoming Webhook** called from a server route.

---

## 0.1 PHASE 1 SCOPE — obey exactly

**BUILD these 5 sections (ready, live Supabase data, no blockers):**
| Section | Day | Lives on |
|---|---|---|
| **The Pulse** | Monday | Front Page |
| **Signed Calls** (Today's Calls) | Monday | Front Page |
| **Mug Shots** | Monday | Front Page |
| **Fresh Ink** | Tuesday | own section |
| **The Margin Read** | Wednesday | own section |

**BUILD also:** login-gated PWA (splash, signup, login, choose-photo, home base), delivery-pace choice, the **exceptions-feed** front page, daily reveal + push (Mon–Wed), and **ONE internal Slack button — "Send to team" — `#rev-changes-lip`** (RM flags units → RR team acts).

**DO NOT BUILD — not even stubbed:** Markets, Watch Coming, Action Desk box score, Op-Ed, Owner Receipts, the all-homes Reading Room, and **anything homeowner-facing**. **Delete the old "Send update to owner" / `#owner-updates` Slack button entirely** — it is not relabeled, it is removed. No homeowner Slack. No owner communication of any kind.

---

## 1. Design system (use these values verbatim)

### Color tokens
```
--paper      #fbfaf6   /* app background, light surfaces */
--ink        #16140f   /* primary text, dark panels, primary buttons */
--sub        #55504a   /* secondary/body text */
--muted      #7a746b   /* tertiary text, labels */
--faint      #a49d90   /* disabled text, hints, locked states */
--line       #d8d2c6   /* borders, hairline rules */
--card-line  #e2dccf   /* card borders */
--warm-1     #f4f0e7   /* locked/inset card fill */
--warm-2     #f5f1e8   /* dashed inset fill */
--chrome     #e9e4da   /* desktop browser/title-bar chrome */
--red        #c0341d   /* PRIMARY ACCENT — CTAs, alarms, "drop" verdict, kickers */
--green      #0d6b39   /* winners, positive metrics, "live" status */
--amber      #b07a17   /* "watch" verdict */
--blue       #21506b   /* links, avatar gradient top */
--slack      #4a154b   /* internal Slack "Send to team" button + channel chip */
--avatar-grad  linear-gradient(150deg, #21506b, #16303f)   /* monogram avatar fill */
```
Whites/blacks are warm — never pure #fff/#000 for surfaces (buttons on dark may use #fff text). Keep accent saturation restrained; do not introduce new hues.

### Typography (Google Fonts)
Load: `Fraunces` (ital,opsz,wght 9..144 · 400,500,600,700 + italic 400,500), `Source Serif 4` (400,600 + italic 400), `Inter` (400,500,600), `JetBrains Mono` (400,500).

Roles:
- **Fraunces (serif display)** — all headlines, the masthead wordmark, big numbers, avatar monogram. Tight tracking (`letter-spacing:-.01em to -.02em`) at large sizes.
- **Source Serif 4 (serif body)** — body copy, taglines, descriptions, pull-quotes (italic).
- **Inter (sans)** — UI: buttons, nav, tabs, metric labels, form field chrome.
- **JetBrains Mono (mono)** — kickers, section labels, dot-status captions, dates/vol lines. UPPERCASE, letter-spacing `.1em`–`.34em`.

### Reusable component styles
- **Primary CTA:** `background:#c0341d; color:#fff; border-radius:12px; padding:15–17px; font:600 15–16px Inter;`. Dark variant: `background:#16140f`.
- **Internal Slack CTA ("Send to team"):** `background:#4a154b; color:#fff; border-radius:13px;` with a white rounded "S" chip (20px) on the left; gap 10px. Posts to `#rev-changes-lip`.
- **Text input (display):** `border:1px solid #d8d2c6; border-radius:10–11px; padding:13–16px; background:#fff; font:400 14–15px 'Source Serif 4';` password rows show label left + `••••••••` right in ink, letter-spacing 2px.
- **Kicker label:** `font:600 10.5–11px 'JetBrains Mono'; letter-spacing:.14–.2em; color:#c0341d; text-transform:uppercase`.
- **Verdict pills** (rounded, soft-tint bg at 10–12% of the hue):
  - Winner — `▲` text `#0d6b39` on `rgba(13,107,57,.1)`
  - Drop — `▼` text `#c0341d` on `rgba(192,52,29,.1)`
  - Watch — `●` text `#b07a17` on `rgba(176,122,23,.12)`
  - `font:600 12–12.5px Inter; border-radius:8–20px; padding:6–8px 11–12px`.
- **Monogram avatar:** circle, `background:var(--avatar-grad)`, centered Fraunces initials (e.g. "LP") in `#fbfaf6`; edit badge bottom-right (✎ on light, or red "+" in upload state).
- **Home card (Mug Shot / flagged home):** white card, `border:1px solid #e2dccf; border-radius:12px`; a rect image slot (striped placeholder), address + bedroom-size line, the one-line problem, and a verdict pill.
- **Call row (Signed Calls):** white row, checkbox left, home + recommended action, `border-bottom:1px solid #f0ebe0`.
- **Day tab (active):** pill `background:#16140f; color:#fff`. **Locked:** `background:#f0ebe0; color:#a49d90` + 🔒 and unlock countdown ("14h").
- **Card shadow (desktop windows):** `box-shadow:0 44px 84px -30px rgba(0,0,0,.45)`. Phone bezel: `0 34px 66px -22px rgba(0,0,0,.5)`.

### Frames (reference only — ship responsive, not framed)
The mockups draw phone bezels and desktop browser windows only for presentation. **In the shipped PWA, drop the frames** — build real responsive screens. Keep the address paths (`revandresearch.app/…`) as the actual routes.

---

## 2. The 13 units
Seed as selectable unit (company) accounts. "Life in Paradise" (LIP) is the demo/default:
`Life in Paradise, Island Time, Coastal Keys, Summit Stays, Blue Harbor, Desert Bloom, Pine & Peak, Lakeside Collective, Sunset Shores, Urban Nest, Mountain Modern, Vista Verde, Harborline`.

---

## 3. Core model — the exceptions engine (defines the product)
A unit like LIP manages **~800 homes**. An RM cannot look at 800 homes a week — **that is the problem the paper solves.** The paper reads all of them and surfaces only the **~15–40 that are genuinely off this week**; the rest stay silent (silence = fine). **The app never opens to a list/search of all 800 homes.**

**The home screen IS the exceptions feed.** After the personal home base + "News updates" tap, the RM lands on this week's exceptions — The Pulse (the one number) + Mug Shots (the flagged homes) + Signed Calls (the moves to make) — not a data grid.

**Slack is INTERNAL only.** The single Slack action is **"Send to team"** on Signed Calls: the RM selects flagged units → posts the rate-change brief to `#rev-changes-lip` so the RR team files the changes. **Homeowners are never involved.** (Phase 1 audience = the RM. The CEO/Marketing/Reservations altitude views and the all-homes Reading Room are later-phase — do not build.)

---

## 4. The edition & reveal schedule (Phase 1 = 3-day drip)
One weekly edition per unit + week number (e.g. "Week 28"). Sections reveal by day:
- **Monday — The Front Page** = **The Pulse** + **Signed Calls** + **Mug Shots** (the 5-minute must-knows, and the exceptions feed).
- **Tuesday — Fresh Ink** (homes that just flipped status this week).
- **Wednesday — The Margin Read** (the deeper margin/profitability read).

**Delivery pace** (chosen first entry each week, changeable weekly, gated server-side):
- **Daily read (default):** only today + past days unlocked; future days show 🔒 + countdown; a **push** fires each morning a day unlocks. Next-day control disabled until unlock.
- **Weekly read:** all three days unlocked at once.

Day tabs everywhere show **Mon · Tue · Wed** only (3 tabs). No Thu/Fri.

---

## 5. Screens — PHONE (build every one)
Single column, paper background, ~44px safe-area top. Onboarding CTAs full-width at bottom.

**P1 · Splash** — Full-dark (`#16140f`, text `#fbfaf6`), centered. Red mono "EST. 2025". Wordmark **"Rev & Research"** Fraunces 700 ~46px. 38×2px red divider. Italic Source Serif tagline ~17px `#cfc9bd`: *"The numbers behind every night booked."* Near bottom: 170px animated indeterminate loading bar (track `rgba(255,255,255,.14)`, red sliding fill) + mono "PREPARING THIS WEEK'S EDITION". Auto-advances when shell + session check finish.

**P2 · Sign up** — Header with centered red mono wordmark. H2 Fraunces ~25px "Create your account" + sub "Select the unit you manage." "YOUR UNIT" then a bordered unit list: **Life in Paradise** selected as a dark row with a red ✓; a few more light rows; last row mono "+ 9 more units". Email + password inputs. Sticky bottom: red "Create account" + "Already have one? **Log in**" (blue link).

**P3 · Log in** — Centered. Red mono wordmark. H2 Fraunces ~30px "Welcome back" + sub "Life in Paradise — sign in to today's edition." Email + password. Blue "Forgot password?". Dark "Log in" CTA. Footer "New here? **Create an account**".

**P4 · Choose photo** — Centered. H2 "Add a photo" + sub. 150px dashed circle, striped placeholder (`repeating-linear-gradient(45deg,#efeade,#efeade 7px,#e6e0d2 7px,#e6e0d2 14px)`), mono "your photo", red "+" badge. Dark "Upload from device" CTA (file picker → Supabase storage, crop to circle). "Skip for now" link.

**P5 · Home base** — Centered. Red mono wordmark near top. ~158px **monogram avatar** (avatar gradient, "LP") + ✎ badge. Caption "Managing unit", H2 Fraunces ~30px **"Life in Paradise"**, sub "Revenue Desk · Week of Jul 6". Big red CTA **"News updates →"** (elevated). Green dot-status "Monday's section is live". CTA → exceptions feed.

**P6 · Delivery pace** — H2 "How should we deliver this week?" + sub "Same edition either way — you choose the pace." Two stacked cards: **Daily reveal** (selected: 2px ink border + ink ✓) desc "One section unlocks each day, Mon–Wed. We'll ping you when the next is ready." with a **3-segment** progress row (1st ink, rest `#d8d2c6`); **Read it all now** with a **3-segment** all-green row. Bottom red "Continue".

**P7 · Front Page = EXCEPTIONS FEED** (the home of the app) — Newspaper header (double-rule): mono "LIFE IN PARADISE" / "WK 28"; centered Fraunces "The Weekly"; italic dateline "Monday, July 6, 2026". **3 day tabs: Mon (active, ink) · Tue 🔒 · Wed 🔒.** Then, in order:
  1. **The Pulse** teaser — kicker "MONDAY · THE PULSE", big Fraunces number **"$4.13M"**, one-line deck, tap → P8.
  2. **"23 homes are news this week"** strip (mono count + "silence = the other ~790 are fine").
  3. **Mug Shots** — kicker "MUG SHOTS · FLAGGED THIS WEEK"; a vertical list of 3–4 flagged-home cards (image slot, address + "3BR · Midweek soft", one-line problem, verdict pill). "See all 23 →".
  4. **Signed Calls** teaser — "3 calls to make today →" → P9.

**P8 · The Pulse (reading view)** — Back arrow + mono breadcrumb "FRONT PAGE · THE PULSE". Kicker "THE ONE NUMBER", giant Fraunces **"$4.13M"** (~62px), explanatory paragraph. Wrapped row of the three **verdict pills**. Left-ruled italic pull-quote. Bottom bar: "1 of 3 on the Front Page" + ink "Next →" (Signed Calls).

**P9 · Signed Calls (Today's Calls) + INTERNAL SLACK** — Back arrow + breadcrumb "FRONT PAGE · SIGNED CALLS". H2 Fraunces "Today's calls" + sub "The moves to file with the team." A checklist of **call rows** — each: checkbox, home ("Palm Villa · 3BR"), recommended action ("Drop Tue–Wed floor 6% → ~$18K"), verdict tint. A couple pre-checked. Sticky bottom: purple **"Send to team → #rev-changes-lip"** button (white "S" chip). On send: toast "Filed 3 calls to #rev-changes-lip". **This is the only Slack button in the app.**

**P10 · Fresh Ink (Tuesday)** — Back arrow + breadcrumb "TUESDAY · FRESH INK". Kicker + H2 Fraunces "Fresh Ink" + italic deck "What flipped overnight." A short list of 2–3 "newly-news" homes (newly soft / newly recovered) with a green/red status flag and a one-line note each. Locked when in daily mode before Tuesday (shows 🔒 + "Unlocks Tue 7:30am").

**P11 · The Margin Read (Wednesday)** — Back arrow + breadcrumb "WEDNESDAY · THE MARGIN READ". Kicker + H2 Fraunces "The Margin Read". A longer analytical read: 1–2 Source Serif paragraphs, a **chart placeholder** (striped rect, mono "margin-by-bedroom chart"), and a boxed takeaway. Locked before Wed in daily mode.

**P12 · Next-day push (notification state)** — Lock-screen representation. Dark gradient (`linear-gradient(170deg,#1c3444,#16140f 70%)`), big clock "7:30" + "Tuesday". Frosted card: red "R" chip + mono "REV & RESEARCH" + "now"; title **"Tuesday's section is ready 📰"**; body "Fresh Ink: the 3 listings that jumped in demand overnight. Tap to read." Mono "SWIPE TO OPEN". Real web-push with this copy; tap deep-links to the newly unlocked section.

---

## 6. Screens — DESKTOP (≥1024px; build every one)
Windowed newspaper aesthetic, generous margins, capped max-width.

**D1 · Log in** — Split 2-pane. Left dark ink: mono "EST. 2025", huge Fraunces "Rev & Research" (~72px), 46×3px red rule, italic tagline `#cfc9bd`, bottom mono "13 UNITS · ONE WEEKLY EDITION · REVEALED DAILY". Right paper (~480px): "Welcome back", sub, email + password, blue "Forgot password?", ink "Log in", "New here? Create an account".

**D2 · Sign up** — Same split. Left dark: mono "JOIN THE DESK", Fraunces "One paper. / Your unit." (~60px), red rule, italic "Pick the unit you manage — every edition is written for it.", bottom mono "13 UNITS · REVENUE DESK". Right (~500px): "Create your account", unit dropdown row "Life in Paradise · 1 of 13 ⌄", email, password, red "Create account", "Already have one? Log in".

**D3 · Choose photo** — Two columns. Left: kicker "ALMOST THERE", H1 "Add a photo" (~42px), paragraph, buttons ink "Browse files" + outline "Skip for now". Right (~400px): 180px dashed striped upload circle + red "+" badge, and a dashed drop-zone card "Drag an image here" + mono "PNG or JPG · up to 5MB". Real drag+drop, crop to circle.

**D4 · Delivery pace** — Centered. Mono "LIFE IN PARADISE · WEEK 28", H1 "How should we deliver this week?" (~40px), sub. Two side-by-side cards: **Daily read** (selected, 2px ink border, ink ✓, red "RECOMMENDED", **3-seg** 1 ink, mono "MON · TUE · WED") and **Weekly read** (empty radio, "ALL AT ONCE", **3-seg** all green, mono "ALL 3 DAYS · UNLOCKED"). Red "Continue".

**D5 · Home base / dashboard** — Two columns. **Left rail (~266px, dark ink):** red mono wordmark; 96px monogram avatar + Fraunces unit name + "Revenue Desk"; nav — "This week's edition" (active), "Archive", "Settings" (inactive; **no "Owner updates"**); bottom mono "DAILY REVEAL · ON". **Main (paper):** "Monday, July 6 · Week 28" + green dot "New section live"; H1 "Good morning, Life in Paradise" + sub "23 homes are news this week."; a dark hero card — kicker "MONDAY · THE PULSE" + Fraunces "The $4.13M your topline is hiding" + red "Open the feed →"; mono "THIS WEEK'S EDITION"; a **3-column day grid** — Mon "Front Page · Pulse · Signed Calls · Mug Shots" (ink border, "● Live"), Tue "Fresh Ink" ("🔒 14h"), Wed "The Margin Read" ("🔒"). No Thu/Fri.

**D6 · The broadsheet (exceptions feed — the hero screen)** — Full newspaper page. **Masthead:** `border-bottom:3px double #16140f`; top mono "Life in Paradise" / "Vol. XII · Week 28" / "Mon, Jul 6, 2026"; centered Fraunces "The Weekly" (~56px); centered italic tagline. **Day tab bar:** Mon · Front Page (active) · Tue 🔒 · Wed 🔒. **Headline block:** kicker "THE FRONT PAGE · THE PULSE", H1 "The $4.13M Your Topline Is Hiding" (~46px), italic deck. **Two-region body:** left = 2-column justified Source Serif article (drop cap) that reads as the Pulse story; right sidebar = "THE PULSE" giant "$4.13M" (~68px) + the three verdict pills stacked + a top-ruled pull-quote. Below the fold: a **Mug Shots** row of flagged-home cards and a **Signed Calls** block whose CTA is the purple **"Send to team → #rev-changes-lip"** button. Real revenue copy (see §8).

*(No D7. The old weekly-wrap — owner Slack screen is deleted.)*

---

## 7. Behavior (must implement)
1. **Auth:** Supabase email+password, session persists per device; protected routes redirect to `/login`.
2. **Accounts = per unit;** chosen unit stored on profile. Phase 1 role = RM.
3. **Avatar upload** from device → Supabase storage; circle crop; monogram fallback.
4. **Exceptions feed** is the main content: render only the ~15–40 flagged homes for the unit/week; never list all 800. "See all 23" expands within the feed (still the flagged set — NOT the Reading Room).
5. **Reveal gating** by day (Mon/Tue/Wed) enforced server-side; locked tabs/sections show 🔒 + countdown; next-day control disabled until unlock.
6. **Daily push:** web-push fires each morning a day unlocks (P12 copy); email fallback; deep-links to the section.
7. **Reader progress** persisted to DB; resumes across devices.
8. **Internal Slack — the ONLY Slack action:** "Send to team" on Signed Calls POSTs the selected calls as a formatted brief to `#rev-changes-lip` via a server route + Incoming Webhook. Show sent status. No homeowner Slack, no other channels.
9. **PWA:** manifest (name "Rev & Research", theme `#16140f`, bg `#fbfaf6`, standalone), custom icon (red rounded tile, white Fraunces "R"), service worker (offline shell + push), Add-to-Home-Screen.
10. **Responsive** phone ≤640 / desktop ≥1024; touch targets ≥44px; AA contrast on verdict tints.

---

## 8. Sample content (realistic placeholder; wire to live Supabase)
- **The Pulse:** "$4.13M left on the table this quarter across 214 active homes — almost entirely in midweek shoulder nights that were never repriced." Verdicts: Winner — Weekend occupancy 94%; Drop — Tue–Wed at 61%; Watch — 30-day pace softening. Pull-quote: "The demand is there. The rate isn't. Move the floor, not the weekend."
- **Mug Shots (flagged homes):** "Palm Villa · 3BR — Midweek soft, 6 open Tue–Wed" (Drop); "Coral Casita · 2BR — Priced 11% under comp set" (Watch); "Dune House · 4BR — Weekend sold out, could push rate" (Winner).
- **Signed Calls (Today's Calls):** "Palm Villa · 3BR — Drop Tue–Wed floor 6% → ~$18K"; "Coral Casita · 2BR — Match comp set, +$40/nt"; "Bay Bungalow · 1BR — Open the Sept window now."
- **Fresh Ink (Tue):** "Reef Retreat flipped from healthy to soft — pace fell 22% in 3 days." / "Harbor Loft recovered — the Friday floor drop worked."
- **The Margin Read (Wed):** short essay on 4BR homes carrying revenue but thinning margin due to cleaning-cost drift; chart placeholder "margin-by-bedroom"; boxed takeaway.
- **Front-page counts:** "23 homes are news this week"; "silence = the other ~790 are fine."

---

## 9. Data model (Supabase — minimum)
- `units` (id, name) — seed the 13.
- `profiles` (user_id, unit_id, display_name, avatar_url).
- `editions` (id, unit_id, week_number, published_at).
- `sections` (id, edition_id, key ['pulse'|'signed_calls'|'mug_shots'|'fresh_ink'|'margin_read'], day [1=Mon,2=Tue,3=Wed], title, body_json, unlock_at).
- `flagged_homes` (id, edition_id, address, bedrooms, problem, verdict ['winner'|'drop'|'watch']).
- `signed_calls` (id, edition_id, home, action, est_value, checked_default).
- `reader_prefs` (user_id, edition_id, pace ['daily'|'weekly']).
- `reader_progress` (user_id, section_id, read_at).
- `slack_sends` (id, unit_id, edition_id, channel '#rev-changes-lip', payload_json, sent_at).

*(No owner/homeowner tables. No reading-room table.)*

---

## 10. Acceptance checklist
- [ ] Only the 5 sections exist: The Pulse, Signed Calls, Mug Shots (Mon), Fresh Ink (Tue), The Margin Read (Wed). No Markets / Watch Coming / Box Score / Op-Ed / Owner Receipts / Reading Room anywhere.
- [ ] Home screen opens to the **exceptions feed** (~15–40 flagged homes) — never a list/search of 800.
- [ ] Day tabs are **Mon · Tue · Wed** only; daily reveal gates Tue/Wed with 🔒 + countdown.
- [ ] The **only** Slack button is "Send to team" → `#rev-changes-lip` on Signed Calls. The "Send update to owner"/`#owner-updates` button is **deleted**, and nothing homeowner-facing exists.
- [ ] Colors/fonts exactly per §1; warm paper/ink; Fraunces/Source Serif/Inter/JetBrains Mono.
- [ ] Login once per device; avatar upload + monogram fallback.
- [ ] Daily web-push fires on unlock (P12 copy) and deep-links.
- [ ] Installable PWA: manifest, red "R" icon, offline shell, standalone.
- [ ] Responsive phone → desktop; ≥44px targets; AA contrast.
