-- Run after schema.sql + 02_extra.sql + 03_section_content.sql.
--
-- Replaces the placeholder demo copy with the figures reported from the
-- Jul 2026 snapshot (metric snapshot 2026-07-01 / reservations snapshot
-- 2026-06-29, Jul-Aug-Sep 2026 window). These numbers were NOT queried by
-- this session -- they were relayed from a separate conversation against a
-- different Supabase project and are not independently verified here. This
-- is demo seed content for this app's own editions/sections tables, not a
-- live connection to that analytics project.
--
-- Fresh Ink is intentionally left untouched: only aggregate figures (1,737
-- bookings / $1.83M nightly / $1.06M fees) were available, not the
-- per-unit rows this app's fresh_ink items need, so inventing specific
-- "new booking" rows would mean fabricating data. Quiet Winners and The
-- CEO Cut aren't seeded here either -- this app has no section/schema for
-- them yet (see chat).
--
-- Safe to re-run: deletes and re-inserts scoped to the target edition.

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
update sections set body_json = jsonb_build_object(
  'headline', 'You''re $1.76M Ahead of Last Summer',
  'number', '+$1.76M',
  'paragraph', '+$1.76M ahead of last year (+27.3%) on 19,026 guest nights (+13%) -- 47,596 nights are still open across the portfolio.',
  'verdicts', jsonb_build_array(
    jsonb_build_object('verdict', 'winner', 'label', '+$1.76M vs LY (+27.3%)'),
    jsonb_build_object('verdict', 'winner', 'label', '19,026 guest nights (+13%)'),
    jsonb_build_object('verdict', 'watch', 'label', '47,596 nights still open')
  ),
  'pullQuote', 'The 4- and 5-bedrooms are carrying it, running +13% more guest nights -- a margin year. A handful of 3-bedrooms are the only thing still on the phones.'
)
where key = 'pulse' and edition_id in (select id from target_edition);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
update sections set body_json = jsonb_build_object(
  'headline', 'The $4.29M Your Topline Is Hiding',
  'paragraphs', jsonb_build_array(
    '5,303 turns banked on the Jul-Sep forward book, $4.29M in fees -- $809 per turn, avg length of stay 3.5 nights.',
    'The margin isn''t coming from rate. It''s coming from turns: more, shorter stays are booking the same nights harder than a single long stay would.'
  ),
  'chartLabel', 'margin-by-bedroom chart',
  'takeaway', 'Protect turn volume before you touch rate -- that''s where the $4.29M is actually coming from.'
)
where key = 'margin_read' and edition_id in (select id from target_edition);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
delete from flagged_homes where edition_id in (select id from target_edition);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
insert into flagged_homes (edition_id, address, bedrooms, problem, verdict)
select id, address, bedrooms, problem, verdict from target_edition, (values
  ('RD215 · Purdy Sunset', 6, '67% occ vs 84% LY · posted $806, 30% over Late ADR $620', 'drop'),
  ('DDH · Dorado Dunes #H', 3, '$0 vs $13,566 LY · 92 open · no pickup', 'drop'),
  ('SBP306 · Cielo Vista', 3, '$0 vs $10,948 LY · 74 open · no pickup', 'drop'),
  ('SBS701 · Summer Vibes', 4, 'Behind pace 2+ months · no pickup in 14 days', 'watch'),
  ('FLD272 · Mahi Bay', 4, 'Behind pace 2+ months · no pickup in 14 days', 'watch')
) as h(address, bedrooms, problem, verdict);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
delete from signed_calls where edition_id in (select id from target_edition);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
insert into signed_calls (edition_id, home, action, est_value, checked_default)
select id, home, action, est_value, checked_default from target_edition, (values
  ('DDH · Dorado Dunes #H · 3BR', 'Wake it up -- price toward Late ADR $539', '$13.6K', true),
  ('SBP306 · Cielo Vista · 3BR', 'Wake it up -- price toward Late ADR $456', '$10.9K', true),
  ('RD215 · Purdy Sunset · 6BR', 'Drop the rate -- 30% over Late ADR $620', '—', true),
  ('SBS529 · Dune Allright · 4BR', 'Drop the rate -- 17% over Late ADR $746', '—', false),
  ('SBKC642 · The Emerald · 8BR', 'Don''t cut, push -- 19% under Late ADR, +5 nights in 2wk', '—', false)
) as c(home, action, est_value, checked_default);
