// Shared early-warning detection: scans public report intake for two
// signals — the same scammer contact (phone/email/website) showing up
// across multiple reports, and a category spiking versus the prior
// 30-day window. Used by both generateDailyDrafts.ts (drafts a longer
// explainer article for human review) and generateAlertCandidates.ts
// (queues a short member alert for human review) — same detection,
// two different review queues and output shapes.
import { pool } from '../db/connection';
import { DraftInput } from './anthropic';

const MIN_RECURRING_CONTACT_REPORTS = 2;
const MIN_CATEGORY_SPIKE_REPORTS = 3;
// Higher bar than the national 3: a single state's counts are small, so
// a couple of reports in a low-population state shouldn't read as a spike.
export const MIN_STATE_CATEGORY_SPIKE_REPORTS = 5;

export interface DetectedPattern {
  input: DraftInput;
  dedupeTag: string;
  // Set only on state-scoped patterns (detectStateCategorySpikes).
  state?: string;
  // Recurring contacts only: the state of each matching report that has
  // one (reports without a state are left out, so this can be shorter
  // than reportDescriptions). Used to decide whether an alert about the
  // contact can go to one state instead of nationwide.
  reportStates?: string[];
  // Recurring contacts only: the true number of matching reports
  // (reportDescriptions is capped at 8).
  reportCount?: number;
}

export async function detectRecurringContacts(): Promise<DetectedPattern[]> {
  const patterns: DetectedPattern[] = [];

  for (const column of ['scammer_phone', 'scammer_email', 'scammer_website'] as const) {
    const { rows } = await pool.query(
      `SELECT ${column} AS contact, array_agg(description) AS descriptions, COUNT(*) AS n,
              COALESCE(array_agg(state) FILTER (WHERE state IS NOT NULL), '{}') AS states
       FROM scam_reports
       WHERE ${column} IS NOT NULL AND created_at >= NOW() - INTERVAL '60 days'
       GROUP BY ${column}
       HAVING COUNT(*) >= $1`,
      [MIN_RECURRING_CONTACT_REPORTS]
    );
    for (const row of rows) {
      patterns.push({
        input: {
          kind: 'recurring_contact',
          recurringContact: row.contact,
          reportDescriptions: row.descriptions.slice(0, 8),
        },
        dedupeTag: `pattern:contact:${row.contact}`,
        reportStates: row.states,
        reportCount: Number(row.n),
      });
    }
  }
  return patterns;
}

export async function detectCategorySpikes(): Promise<DetectedPattern[]> {
  const { rows } = await pool.query(`
    SELECT
      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      COUNT(*) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') AS count_last_30d,
      COUNT(*) FILTER (
        WHERE r.created_at >= NOW() - INTERVAL '60 days' AND r.created_at < NOW() - INTERVAL '30 days'
      ) AS count_prior_30d,
      array_agg(r.description) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') AS descriptions
    FROM categories c
    JOIN scam_reports r ON r.category_id = c.id
    GROUP BY c.id, c.name, c.slug
    HAVING COUNT(*) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') >= $1
  `, [MIN_CATEGORY_SPIKE_REPORTS]);

  const monthKey = new Date().toISOString().slice(0, 7);
  const patterns: DetectedPattern[] = [];
  for (const row of rows) {
    const last30d = Number(row.count_last_30d);
    const prior30d = Number(row.count_prior_30d);
    if (last30d <= prior30d) continue;
    patterns.push({
      input: {
        kind: 'category_spike',
        categoryName: row.category_name,
        countLast30d: last30d,
        countPrior30d: prior30d,
        reportDescriptions: (row.descriptions ?? []).slice(0, 8),
      },
      dedupeTag: `pattern:category:${row.category_slug}:${monthKey}`,
    });
  }
  return patterns;
}

// Same spike test as detectCategorySpikes, per (state, category), over
// reports that carry a state. Not part of detectAllPatterns: the drafted-
// article job stays national, and generateAlertCandidates only calls this
// when state detection is switched on.
export async function detectStateCategorySpikes(
  minReports = MIN_STATE_CATEGORY_SPIKE_REPORTS
): Promise<DetectedPattern[]> {
  const { rows } = await pool.query(`
    SELECT
      r.state,
      c.name AS category_name,
      c.slug AS category_slug,
      COUNT(*) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') AS count_last_30d,
      COUNT(*) FILTER (
        WHERE r.created_at >= NOW() - INTERVAL '60 days' AND r.created_at < NOW() - INTERVAL '30 days'
      ) AS count_prior_30d,
      array_agg(r.description) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') AS descriptions
    FROM categories c
    JOIN scam_reports r ON r.category_id = c.id
    WHERE r.state IS NOT NULL AND r.created_at >= NOW() - INTERVAL '60 days'
    GROUP BY r.state, c.id, c.name, c.slug
    HAVING COUNT(*) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') >= $1
  `, [minReports]);

  const monthKey = new Date().toISOString().slice(0, 7);
  const patterns: DetectedPattern[] = [];
  for (const row of rows) {
    const last30d = Number(row.count_last_30d);
    const prior30d = Number(row.count_prior_30d);
    if (last30d <= prior30d) continue;
    patterns.push({
      input: {
        kind: 'category_spike',
        categoryName: row.category_name,
        countLast30d: last30d,
        countPrior30d: prior30d,
        reportDescriptions: (row.descriptions ?? []).slice(0, 8),
      },
      dedupeTag: `pattern:category:${row.category_slug}:${row.state}:${monthKey}`,
      state: row.state,
    });
  }
  return patterns;
}

export async function detectAllPatterns(): Promise<DetectedPattern[]> {
  return [...(await detectRecurringContacts()), ...(await detectCategorySpikes())];
}
