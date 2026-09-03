import { pool } from '../db/connection';

export interface ReportFiling {
  id: string;
  report_id: string;
  agency_name: string;
  agency_url: string;
  status: 'suggested' | 'filed' | 'not_applicable';
  reference_number: string | null;
  filed_at: string | null;
  filed_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgencySuggestion {
  agency_name: string;
  agency_url: string;
  reason: string;
}

interface ReportForSuggestion {
  country: string | null;
  category_slug?: string | null;
  scammer_email: string | null;
  scammer_website: string | null;
}

// Real agencies only, matched by what's actually true about the report —
// no invented "we filed with X" options. US logic is hand-picked because
// the FTC and IC3 have genuinely different, well-known scopes; every
// other country reuses whatever is already vetted in global_sources
// rather than guessing at agencies we haven't verified.
export async function suggestAgenciesForReport(report: ReportForSuggestion): Promise<AgencySuggestion[]> {
  const suggestions: AgencySuggestion[] = [];
  const country = report.country ?? 'US';

  if (country === 'US') {
    if (report.category_slug === 'identity-theft') {
      suggestions.push({
        agency_name: 'FTC IdentityTheft.gov',
        agency_url: 'https://www.identitytheft.gov/',
        reason: 'The FTC\'s dedicated identity theft reporting and recovery-plan site.',
      });
    } else {
      suggestions.push({
        agency_name: 'FTC — ReportFraud.ftc.gov',
        agency_url: 'https://reportfraud.ftc.gov/',
        reason: 'The FTC\'s general consumer fraud reporting portal — applies to most U.S. scam reports.',
      });
    }
    if (report.scammer_email || report.scammer_website) {
      suggestions.push({
        agency_name: 'FBI Internet Crime Complaint Center (IC3)',
        agency_url: 'https://www.ic3.gov/',
        reason: 'The scam involved email or a website, which falls under IC3\'s internet-crime scope.',
      });
    }
  } else {
    const { rows } = await pool.query<{ agency_name: string; url: string }>(
      'SELECT agency_name, url FROM global_sources WHERE country = $1 ORDER BY agency_name ASC',
      [country]
    );
    for (const row of rows) {
      suggestions.push({
        agency_name: row.agency_name,
        agency_url: row.url,
        reason: `The national fraud-reporting body for the report's country.`,
      });
    }
  }

  return suggestions;
}

export async function listFilingsForReport(reportId: string) {
  const { rows } = await pool.query<ReportFiling>(
    'SELECT * FROM report_filings WHERE report_id = $1 ORDER BY created_at ASC',
    [reportId]
  );
  return rows;
}

export interface NewReportFiling {
  agency_name: string;
  agency_url: string;
  status?: 'suggested' | 'filed' | 'not_applicable';
  reference_number?: string;
  notes?: string;
  filed_by?: string;
}

export async function createFiling(reportId: string, data: NewReportFiling) {
  const status = data.status ?? 'suggested';
  const filedAt = status === 'filed' ? new Date() : null;
  const { rows } = await pool.query<ReportFiling>(
    `INSERT INTO report_filings (report_id, agency_name, agency_url, status, reference_number, notes, filed_by, filed_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [reportId, data.agency_name, data.agency_url, status, data.reference_number ?? null, data.notes ?? null, data.filed_by ?? null, filedAt]
  );
  return rows[0];
}

export interface UpdateReportFiling {
  status?: 'suggested' | 'filed' | 'not_applicable';
  reference_number?: string;
  notes?: string;
  filed_by?: string;
}

export async function updateFiling(id: string, data: UpdateReportFiling) {
  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (data.status !== undefined) {
    sets.push(`status = $${i++}`);
    values.push(data.status);
    if (data.status === 'filed') {
      sets.push(`filed_at = NOW()`);
    }
  }
  if (data.reference_number !== undefined) {
    sets.push(`reference_number = $${i++}`);
    values.push(data.reference_number);
  }
  if (data.notes !== undefined) {
    sets.push(`notes = $${i++}`);
    values.push(data.notes);
  }
  if (data.filed_by !== undefined) {
    sets.push(`filed_by = $${i++}`);
    values.push(data.filed_by);
  }
  if (sets.length === 0) return null;
  sets.push('updated_at = NOW()');

  const { rows } = await pool.query<ReportFiling>(
    `UPDATE report_filings SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    [...values, id]
  );
  return rows[0] ?? null;
}
