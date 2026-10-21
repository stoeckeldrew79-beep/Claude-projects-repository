import { pool } from '../db/connection';

export interface ContactMatch {
  kind: 'phone' | 'email' | 'website';
  value: string;
  reports: number;
  lastReportedAt: string | null;
}

// How often a phone number, email or website from a checked message has
// been named in reports to us. Reports are unmoderated until an admin
// reviews them, so one stray report isn't shown — a contact needs two
// reports, or one an admin has already reviewed, before it counts. Only
// the count and date are returned, never the reports themselves.
const COUNTED = `status <> 'dismissed'`;
const SHOWN = `HAVING count(*) >= 2 OR bool_or(status IN ('reviewed', 'promoted'))`;

export async function contactReports(contacts: { phones: string[]; emails: string[]; hosts: string[] }): Promise<ContactMatch[]> {
  const out: ContactMatch[] = [];
  const phoneKeys = contacts.phones.map((p) => p.replace(/\D/g, '').slice(-10)).filter((d) => d.length === 10);

  if (phoneKeys.length) {
    const { rows } = await pool.query(
      `SELECT right(regexp_replace(scammer_phone, '\\D', '', 'g'), 10) AS value, count(*)::int AS reports,
              max(created_at) AS last_reported_at
       FROM scam_reports
       WHERE scammer_phone IS NOT NULL AND ${COUNTED}
         AND right(regexp_replace(scammer_phone, '\\D', '', 'g'), 10) = ANY($1::text[])
       GROUP BY 1 ${SHOWN}`,
      [phoneKeys]
    );
    for (const r of rows) {
      const original = contacts.phones.find((p) => p.replace(/\D/g, '').endsWith(r.value)) ?? r.value;
      out.push({ kind: 'phone', value: original, reports: r.reports, lastReportedAt: r.last_reported_at });
    }
  }

  if (contacts.emails.length) {
    const { rows } = await pool.query(
      `SELECT lower(trim(scammer_email)) AS value, count(*)::int AS reports, max(created_at) AS last_reported_at
       FROM scam_reports
       WHERE scammer_email IS NOT NULL AND ${COUNTED} AND lower(trim(scammer_email)) = ANY($1::text[])
       GROUP BY 1 ${SHOWN}`,
      [contacts.emails]
    );
    for (const r of rows) out.push({ kind: 'email', value: r.value, reports: r.reports, lastReportedAt: r.last_reported_at });
  }

  if (contacts.hosts.length) {
    // The host part of whatever was typed: no scheme, no www., no path.
    const { rows } = await pool.query(
      `SELECT h AS value, count(*)::int AS reports, max(created_at) AS last_reported_at
       FROM (
         SELECT lower(regexp_replace(regexp_replace(trim(scammer_website), '^[a-z][a-z0-9+.-]*://', '', 'i'), '^www\\.|[/:?#].*$', '', 'g')) AS h,
                status, created_at
         FROM scam_reports
         WHERE scammer_website IS NOT NULL AND ${COUNTED}
       ) r
       WHERE h = ANY($1::text[])
       GROUP BY h ${SHOWN}`,
      [contacts.hosts]
    );
    for (const r of rows) out.push({ kind: 'website', value: r.value, reports: r.reports, lastReportedAt: r.last_reported_at });
  }
  return out;
}

// Documented scams whose write-up names one of these website addresses —
// fake domains are often quoted verbatim in agency warnings.
export async function scamsMentioningHosts(hosts: string[]) {
  if (!hosts.length) return [];
  const { rows } = await pool.query(
    `SELECT s.slug, s.name, h AS host
     FROM unnest($1::text[]) h
     JOIN LATERAL (
       SELECT slug, name FROM scams
       WHERE is_active = true AND length(h) >= 6 AND description ILIKE '%' || h || '%'
       LIMIT 3
     ) s ON true`,
    [hosts]
  );
  return rows as { slug: string; name: string; host: string }[];
}
