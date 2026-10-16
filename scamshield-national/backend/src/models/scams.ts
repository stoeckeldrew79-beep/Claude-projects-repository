import { pool } from '../db/connection';
import { buildUpdateSet } from '../utils/buildUpdateSet';

const UPDATABLE_SCAM_FIELDS = [
  'name',
  'slug',
  'description',
  'category_id',
  'alert_level',
  'first_recorded',
  'is_active',
  'is_historical',
  'sources',
  'source_url',
  'country',
] as const;

export interface Scam {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  alert_level: 'low' | 'medium' | 'high' | 'critical' | null;
  first_recorded: string | null;
  is_active: boolean;
  is_historical: boolean;
  sources: string[] | null;
  source_url: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

// Every column a client actually reads. Spelled out instead of s.* so the
// generated search_vector (a tsvector holding every stemmed word of the
// name and description) never ships to the browser: it was ~37% of every
// /v1/scams list response and nothing on the frontend reads it. Also lets
// the list query drop SELECT DISTINCT, which had to compare that tsvector
// row by row. Add a column here when a migration adds one clients need.
export const SCAM_COLUMNS = [
  'id',
  'name',
  'slug',
  'description',
  'category_id',
  'alert_level',
  'first_recorded',
  'is_active',
  'is_historical',
  'sources',
  'source_url',
  'country',
  'tags',
  'created_at',
  'updated_at',
] as const;

function scamColumns(alias?: string): string {
  return SCAM_COLUMNS.map((c) => (alias ? `${alias}.${c}` : c)).join(', ');
}

export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

// Turns what someone is typing into a prefix-matching tsquery
// ("voice clon" -> 'voice:* & clon:*'), so the Database search box finds
// "voice cloning" before the word is finished. Only letters and digits
// survive, so nothing a user types can produce tsquery syntax errors.
export function toPrefixTsQuery(input: string): string | null {
  const tokens = input
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 0)
    .slice(0, 8);
  if (tokens.length === 0) return null;
  return tokens.map((t) => `${t}:*`).join(' & ');
}

export interface ScamListFilters {
  category?: string;
  // Victim-targeting label (elder-targeted, veteran-targeted, ...). A
  // separate axis from category: a solar scam aimed at seniors carries both.
  tag?: string;
  state?: string;
  zip?: string;
  country?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'alert_level' | 'name_asc' | 'chronological';
  // 'current' (default) hides historical entries so the main browsing
  // experience stays about active threats; 'historical' shows only the
  // historical archive; 'all' mixes both. 'recent' is a stricter, additive
  // fourth option for the Database page's "Last 30 Days" tab — 'current'
  // itself is left untouched since other pages (Home, the Live Activity
  // ticker, state pages) rely on its existing meaning by omitting `view`
  // entirely and getting the default.
  view?: 'current' | 'historical' | 'all' | 'recent';
  // One or more alert levels (critical, high, medium, low). Additive: no
  // value means every level, as before.
  severity?: SeverityLevel[];
  page?: number;
  pageSize?: number;
}

// Builds the shared WHERE clause so the page query and the optional total
// count can never disagree about what "matching" means.
function buildScamListWhere(filters: ScamListFilters): { where: string; values: unknown[] } {
  const { category, tag, state, zip, country, search, severity, view = 'current' } = filters;
  const conditions: string[] = ['s.is_active = true'];
  const values: unknown[] = [];

  if (view === 'historical') {
    conditions.push('s.is_historical = true');
  } else if (view === 'current') {
    conditions.push('s.is_historical = false');
  } else if (view === 'recent') {
    // A real recency window, not the permanent is_historical classification
    // 'current' uses — a scam added two years ago and never tagged
    // historical would otherwise sit in "recent" forever.
    conditions.push("s.is_historical = false AND s.created_at >= NOW() - INTERVAL '30 days'");
  }

  if (category) {
    values.push(category);
    conditions.push(`c.slug = $${values.length}`);
  }
  if (country) {
    values.push(country);
    conditions.push(`s.country = $${values.length}`);
  }
  if (tag) {
    // Array containment rather than `= ANY(tags)` so the GIN index added in
    // migration 025 is actually used.
    values.push([tag]);
    conditions.push(`s.tags @> $${values.length}`);
  }
  if (severity && severity.length > 0) {
    values.push(severity);
    conditions.push(`s.alert_level = ANY($${values.length}::text[])`);
  }
  if (state || zip) {
    // Same predicate as before (a nationwide location, or one matching the
    // state/zip), as a single EXISTS: the old form LEFT JOINed every
    // location row onto every scam and needed SELECT DISTINCT to undo it.
    const locConditions: string[] = ['l.is_nationwide = true'];
    if (state) {
      values.push(state);
      locConditions.push(`l.state = $${values.length}`);
    }
    if (zip) {
      values.push(zip);
      locConditions.push(`l.zip_code = $${values.length}`);
    }
    conditions.push(
      `EXISTS (SELECT 1 FROM scam_locations l WHERE l.scam_id = s.id AND (${locConditions.join(' OR ')}))`
    );
  }
  const tsq = search ? toPrefixTsQuery(search) : null;
  if (search && tsq) {
    // Name and description (the GIN-indexed search_vector), prefix-matched,
    // instead of exact whole words in the name only — "deepfa" now finds
    // deepfake entries, and a word that only appears in the description
    // counts.
    values.push(tsq);
    conditions.push(`s.search_vector @@ to_tsquery('english', $${values.length})`);
  } else if (search) {
    // Nothing indexable typed (punctuation only): match it literally.
    values.push(`%${search}%`);
    conditions.push(`s.name ILIKE $${values.length}`);
  }

  return { where: conditions.join(' AND '), values };
}

export async function countScams(filters: ScamListFilters): Promise<number> {
  const { where, values } = buildScamListWhere(filters);
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total FROM scams s LEFT JOIN categories c ON c.id = s.category_id WHERE ${where}`,
    values
  );
  return rows[0]?.total ?? 0;
}

export async function listScams(filters: ScamListFilters) {
  const { sort = 'newest', page = 1, pageSize = 20 } = filters;
  const { where, values } = buildScamListWhere(filters);

  // alert_level is free-text ('low'/'medium'/'high'/'critical'), not a
  // Postgres ENUM with a defined order, so a plain ORDER BY alert_level
  // sorts alphabetically (medium, low, high, critical) instead of by
  // actual severity. Rank it explicitly instead.
  const SEVERITY_RANK = `CASE s.alert_level WHEN 'critical' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END`;
  const orderBy =
    sort === 'oldest'
      ? 's.created_at ASC'
      : sort === 'alert_level'
        ? 'severity_rank DESC, s.name ASC'
        : sort === 'name_asc'
          ? 's.name ASC'
          : sort === 'chronological'
            ? 's.first_recorded ASC NULLS LAST, s.name ASC'
            : 's.created_at DESC';

  values.push(pageSize);
  const limitParam = values.length;
  values.push((page - 1) * pageSize);
  const offsetParam = values.length;

  // severity_rank stays in the select list: it is part of the response
  // shape clients already receive. s.id is the final tiebreaker so paging
  // is stable — without it, rows with equal sort keys could repeat or go
  // missing between page 1 and page 2.
  const { rows } = await pool.query(
    `SELECT ${scamColumns('s')}, c.name AS category_name, c.slug AS category_slug, ${SEVERITY_RANK} AS severity_rank
     FROM scams s
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE ${where}
     ORDER BY ${orderBy}, s.id
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    values
  );
  return rows;
}

export async function listActiveCountries() {
  const { rows } = await pool.query(
    `SELECT DISTINCT country FROM scams WHERE is_active = true AND country IS NOT NULL ORDER BY country ASC`
  );
  return rows.map((r) => r.country as string);
}

// Real per-country counts from the curated public database — the same
// source of truth as the rest of the site, not the unvetted report
// intake. Backs the globe visualization.
export async function countsByCountry() {
  const { rows } = await pool.query(
    `SELECT country, COUNT(*) AS count
     FROM scams
     WHERE is_active = true AND country IS NOT NULL AND is_historical = false
     GROUP BY country
     ORDER BY count DESC`
  );
  return rows.map((r) => ({ country: r.country as string, count: Number(r.count) }));
}

// Documented scams per US state. State lives on scam_locations, not on
// scams itself, so this joins rather than reading a column off scams.
// Filtered the same way countsByCountry is — active, non-historical — so
// the two maps count the same population and a state total cannot disagree
// with its country total. The same predicate the state filter in listScams
// uses, so a state's count matches what clicking it actually lists.
export async function countsByState() {
  const { rows } = await pool.query(
    `SELECT l.state, COUNT(DISTINCT s.id) AS count
     FROM scams s
     JOIN scam_locations l ON l.scam_id = s.id
     WHERE s.is_active = true AND s.is_historical = false AND l.state IS NOT NULL
     GROUP BY l.state
     ORDER BY l.state`
  );
  return rows.map((r) => ({ state: r.state as string, total: Number(r.count) }));
}

export async function getScamBySlug(slug: string) {
  const { rows } = await pool.query(
    `SELECT ${scamColumns('s')}, c.name AS category_name, c.slug AS category_slug
     FROM scams s
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.slug = $1`,
    [slug]
  );
  if (!rows[0]) return null;

  const { rows: locations } = await pool.query('SELECT * FROM scam_locations WHERE scam_id = $1', [rows[0].id]);
  return { ...rows[0], locations };
}

// category_name/category_slug are joined in (rather than left for the
// caller to look up separately) because "Check This Now" — this
// function's only real caller — shows them directly on the result card,
// the same way getScamBySlug already does for the detail page.
//
// This is tuned for a free-text description ("I got a call that sounded
// like my grandson saying he was in jail and needed bail money"), not a
// short keyword search:
//
// 1. plainto_tsquery ANDs every word together by default, so a dozen-word
//    sentence would never match any single row. It still does the useful
//    sanitizing work (stemming, stopword removal, safe-lexeme escaping) —
//    its printed form just joins lexemes with '&', so swapping those for
//    '|' turns "must match every term" into "rank by how many match."
// 2. OR alone is too loose in the other direction: with 4,000+ scams, a
//    totally unrelated sentence reliably shares ONE word with something
//    ("today", "weather") purely by chance, which OR-ranking alone can't
//    tell apart from a real match — a coincidental single-word overlap
//    scored close to, or even above, a genuinely relevant multi-word one
//    in testing. Requiring at least two of the query's own distinct terms
//    to actually appear in a row (matched_terms, computed against the
//    same lexemes) filters that out while barely constraining a query
//    that's actually about the same scenario, which naturally shares
//    several terms with it.
// 3. name+description search_vector is a generated, GIN-indexed column
//    (migration 026) rather than to_tsvector(...) computed from raw text
//    inline — the inline version measured 10+ seconds per request against
//    this table (recomputed per row, more than once per row, on every
//    search), which fails "check this in 30 seconds" outright.
export async function searchScams(query: string) {
  const { rows: parsed } = await pool.query(`SELECT plainto_tsquery('english', $1)::text AS tsq`, [query]);
  const lexemes = Array.from(String(parsed[0]?.tsq ?? '').matchAll(/'((?:[^'\\]|\\.)*)'/g)).map((m) => m[1]);
  if (lexemes.length === 0) return [];

  // A flat "at least 2 terms" threshold isn't enough on its own: filler
  // words that survive plainto_tsquery's stopword list because they're not
  // grammatical stopwords ("like", "nice", "get") are still extremely
  // common across 4,000+ scam descriptions, so a totally unrelated
  // sentence can rack up 2 coincidental matches just as easily as a real
  // one — confirmed empirically ("the weather is nice today and I like
  // pizza" hit 2 terms — "weather" and "like" — against an unrelated
  // utility-scam entry). A real multi-word description of what happened
  // matches a real minimum on its lexemes (13 lexemes, 9 matched for a
  // genuine voice-cloning report tested against this database), so
  // requiring a healthy fraction of a longer query's terms filters
  // coincidence out without asking a short, deliberate query (2-3 words,
  // where the site's own search box behavior is the right expectation) for
  // anything more than all of them.
  const minMatchedTerms =
    lexemes.length <= 3 ? lexemes.length : Math.max(3, Math.ceil(lexemes.length * 0.45));

  const { rows } = await pool.query(
    `WITH q AS (
       SELECT to_tsquery('english', replace(plainto_tsquery('english', $1)::text, ' & ', ' | ')) AS tsq
     ),
     scored AS (
       SELECT ${scamColumns('s')}, c.name AS category_name, c.slug AS category_slug,
              ts_rank(s.search_vector, q.tsq) AS rank,
              (SELECT count(*) FROM unnest($2::text[]) term
               WHERE s.search_vector @@ to_tsquery('english', term)) AS matched_terms
       FROM scams s
       CROSS JOIN q
       LEFT JOIN categories c ON c.id = s.category_id
       WHERE s.is_active = true
         AND (s.search_vector @@ q.tsq OR s.description ILIKE '%' || $1 || '%')
     )
     SELECT * FROM scored
     WHERE matched_terms >= $3
     ORDER BY matched_terms DESC, rank DESC
     LIMIT 50`,
    [query, lexemes, minMatchedTerms]
  );
  return rows;
}

export async function scamsNearZip(zip: string) {
  const { rows } = await pool.query(
    `SELECT ${scamColumns('s')}
     FROM scams s
     WHERE s.is_active = true
       AND EXISTS (SELECT 1 FROM scam_locations l WHERE l.scam_id = s.id AND (l.zip_code = $1 OR l.is_nationwide = true))
     ORDER BY s.created_at DESC`,
    [zip]
  );
  return rows;
}

export async function createScam(data: Partial<Scam>) {
  const { rows } = await pool.query(
    `INSERT INTO scams (name, slug, description, category_id, alert_level, first_recorded, is_historical, sources, source_url, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING ${scamColumns()}`,
    [
      data.name,
      data.slug,
      data.description,
      data.category_id ?? null,
      data.alert_level ?? null,
      data.first_recorded ?? null,
      data.is_historical ?? false,
      data.sources ?? [],
      data.source_url ?? null,
      data.country ?? 'US',
    ]
  );
  return rows[0];
}

export async function updateScam(id: string, data: Partial<Scam>) {
  const { fields, setClauses, values } = buildUpdateSet(data, UPDATABLE_SCAM_FIELDS);
  if (fields.length === 0) return getScamById(id);

  setClauses.push('updated_at = NOW()');

  const { rows } = await pool.query(
    `UPDATE scams SET ${setClauses.join(', ')} WHERE id = $1 RETURNING ${scamColumns()}`,
    [id, ...values]
  );
  return rows[0] ?? null;
}

export async function getScamById(id: string) {
  const { rows } = await pool.query(`SELECT ${scamColumns()} FROM scams WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function softDeleteScam(id: string) {
  const { rows } = await pool.query(
    'UPDATE scams SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0] ?? null;
}


// Tags in use, with counts, so a filter can offer only labels that will
// return something. Ordered by frequency: the useful ones surface first.
export async function listScamTags() {
  const { rows } = await pool.query(
    `SELECT unnest(tags) AS tag, count(*)::int AS count
     FROM scams
     WHERE is_active = true AND tags IS NOT NULL
     GROUP BY tag
     ORDER BY count DESC, tag ASC`
  );
  return rows as { tag: string; count: number }[];
}
