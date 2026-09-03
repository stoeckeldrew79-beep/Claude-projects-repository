import { AuthedRequest } from '../middleware/auth';
import * as ScamReportsModel from '../models/scamReports';
import * as ReportFilingsModel from '../models/reportFilings';
import { asyncHandler } from '../utils/asyncHandler';

// Admin-only: real, agency-matched suggestions computed on demand from
// the report's own data — nothing here is persisted until a staff
// member actually acts on one via POST /filings.
export const suggestions = asyncHandler<AuthedRequest>(async (req, res) => {
  const report = await ScamReportsModel.getReportById(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  const suggested = await ReportFilingsModel.suggestAgenciesForReport(report);
  res.json({ data: suggested });
});

export const list = asyncHandler<AuthedRequest>(async (req, res) => {
  const filings = await ReportFilingsModel.listFilingsForReport(req.params.id);
  res.json({ data: filings });
});

// Records that a staff member actually submitted the report through the
// named agency's own portal — this is a manual attestation, not an
// automated submission, matching the site's "human reviews before
// anything real happens" pattern.
export const create = asyncHandler<AuthedRequest>(async (req, res) => {
  const report = await ScamReportsModel.getReportById(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  const { agency_name, agency_url, status, reference_number, notes } = req.body as {
    agency_name?: string;
    agency_url?: string;
    status?: 'suggested' | 'filed' | 'not_applicable';
    reference_number?: string;
    notes?: string;
  };
  if (!agency_name || !agency_url) {
    return res.status(400).json({ error: 'agency_name and agency_url are required' });
  }

  const filing = await ReportFilingsModel.createFiling(req.params.id, {
    agency_name,
    agency_url,
    status,
    reference_number,
    notes,
    filed_by: req.user!.id,
  });
  res.status(201).json({ data: filing });
});

export const update = asyncHandler<AuthedRequest>(async (req, res) => {
  const { status, reference_number, notes } = req.body as {
    status?: 'suggested' | 'filed' | 'not_applicable';
    reference_number?: string;
    notes?: string;
  };
  const filing = await ReportFilingsModel.updateFiling(req.params.filingId, {
    status,
    reference_number,
    notes,
    filed_by: req.user!.id,
  });
  if (!filing) return res.status(404).json({ error: 'Filing not found' });
  res.json({ data: filing });
});
