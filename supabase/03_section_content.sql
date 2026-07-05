-- Run after schema.sql + 02_extra.sql. Fills in the rich copy for Pulse,
-- Fresh Ink, and The Margin Read (schema.sql only seeded title/unlock_at for
-- these). Written as idempotent UPDATEs so it's safe to re-run.

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
update sections set body_json = jsonb_build_object(
  'headline', 'The $4.13M Your Topline Is Hiding',
  'number', '$4.13M',
  'paragraph', '$4.13M left on the table this quarter across 214 active homes — almost entirely in midweek shoulder nights that were never repriced.',
  'verdicts', jsonb_build_array(
    jsonb_build_object('verdict', 'winner', 'label', 'Weekend occupancy 94%'),
    jsonb_build_object('verdict', 'drop', 'label', 'Tue–Wed at 61%'),
    jsonb_build_object('verdict', 'watch', 'label', '30-day pace softening')
  ),
  'pullQuote', 'Drop your Tue–Wed floor 6% and you recover roughly $310K by month-end. The demand is there — the rate isn''t.'
)
where key = 'pulse' and edition_id in (select id from target_edition);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
update sections set body_json = jsonb_build_object(
  'items', jsonb_build_array(
    jsonb_build_object('home', 'Reef Retreat', 'bedrooms', 2, 'status', 'soft', 'tag', 'Newly soft', 'note', 'Flipped from healthy to soft — pace fell 22% in three days. Now on the watch list.'),
    jsonb_build_object('home', 'Harbor Loft', 'bedrooms', 1, 'status', 'recovered', 'tag', 'Recovered', 'note', 'Back to healthy — the Friday floor drop worked. Off the list.'),
    jsonb_build_object('home', 'Cove Cottage', 'bedrooms', 3, 'status', 'new', 'tag', 'New arrival', 'note', 'A new listing undercut its comp set by 9% — watch the weekend.')
  )
)
where key = 'fresh_ink' and edition_id in (select id from target_edition);

with target_edition as (
  select id from editions where unit_id = 'life-in-paradise' order by published_at desc limit 1
)
update sections set body_json = jsonb_build_object(
  'headline', 'The 4BR Margin Squeeze',
  'paragraphs', jsonb_build_array(
    'Your four-bedrooms still carry the topline — but margin is thinning. Cleaning cost per stay drifted up 14% this quarter while ADR held flat, so every booked night nets less than it did in spring.',
    'The gap shows up fastest on turnover-heavy midweek stays: a two-night midweek booking on a 4BR now nets meaningfully less per booked night than the same stay did last year, even though the calendar looks just as full.'
  ),
  'chartLabel', 'margin-by-bedroom chart',
  'takeaway', 'Renegotiate the turn before you touch rate — the leak is in cost, not price.'
)
where key = 'margin_read' and edition_id in (select id from target_edition);
