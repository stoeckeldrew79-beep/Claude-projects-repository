import { AuthedRequest } from '../middleware/auth';
import * as ScamReportsModel from '../models/scamReports';
import * as ScamsModel from '../models/scams';
import * as ReportFilingsModel from '../models/reportFilings';
import { asyncHandler } from '../utils/asyncHandler';
import { InvalidStateError, isUsStateCode, resolveReportState } from '../utils/usStates';

export const create = asyncHandler<AuthedRequest>(async (req, res) => {
  const { description } = req.body as { description?: string };
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ error: 'description is required (at least 10 characters)' });
  }

  let location;
  try {
    location = resolveReportState(req.body);
  } catch (err) {
    if (err instanceof InvalidStateError) return res.status(400).json({ error: err.message });
    throw err;
  }

  const report = await ScamReportsModel.createReport({ ...req.body, ...location });
  res.status(201).json({ data: report });
});

export const list = asyncHandler<AuthedRequest>(async (req, res) => {
  const status = req.query.status as string | undefined;
  const reports = await ScamReportsModel.listReports(status);
  res.json({ data: reports });
});

// Converts a vetted public report into a real, publicly visible scams
// entry — this is the actual protective outcome of the whole intake
// pipeline: unverified tips become curated public intelligence once
// staff confirm them, not before.
export const promote = asyncHandler<AuthedRequest>(async (req, res) => {
  const report = await ScamReportsModel.getReportById(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  if (report.status === 'promoted') return res.status(409).json({ error: 'Report already promoted' });

  const { name, slug, alert_level } = req.body as { name?: string; slug?: string; alert_level?: string };
  if (!name || !slug) return res.status(400).json({ error: 'name and slug are required to promote a report' });

  const scam = await ScamsModel.createScam({
    name,
    slug,
    description: report.description,
    category_id: report.category_id ?? undefined,
    alert_level: alert_level as never,
  });

  const updated = await ScamReportsModel.updateReportReview(report.id, {
    status: 'promoted',
    promoted_scam_id: scam.id,
    reviewed_by: req.user!.id,
    reviewed_at: new Date(),
  });

  res.json({ data: { report: updated, scam } });
});

// Public status lookup by report ID — deliberately returns only the
// fields a reporter needs to see their own status, not the full report
// (which includes the scammer's contact details and other reporters'
// submissions aren't reachable at all without knowing their UUID).
export const status = asyncHandler<AuthedRequest>(async (req, res) => {
  const report = await ScamReportsModel.getReportById(req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  const filings = report.consent_to_file ? await ReportFilingsModel.listFilingsForReport(report.id) : [];

  res.json({
    data: {
      id: report.id,
      status: report.status,
      created_at: report.created_at,
      consent_to_file: report.consent_to_file,
      filings: filings.map((f) => ({
        agency_name: f.agency_name,
        status: f.status,
        reference_number: f.reference_number,
        filed_at: f.filed_at,
      })),
    },
  });
});

export const dismiss = asyncHandler<AuthedRequest>(async (req, res) => {
  const updated = await ScamReportsModel.updateReportReview(req.params.id, {
    status: 'dismissed',
    reviewed_by: req.user!.id,
    reviewed_at: new Date(),
  });
  if (!updated) return res.status(404).json({ error: 'Report not found' });
  res.json({ data: updated });
});

// Staff correction of where a scam happened — see updateReportState.
// Body: { state: "TX" } to set, { state: null } to clear.
export const setState = asyncHandler<AuthedRequest>(async (req, res) => {
  const raw = (req.body as { state?: unknown }).state;
  if (raw === undefined) return res.status(400).json({ error: 'state is required (a US state code, or null to clear)' });

  let state = null;
  if (raw !== null && raw !== '') {
    const code = typeof raw === 'string' ? raw.trim().toUpperCase() : '';
    if (!isUsStateCode(code)) {
      return res.status(400).json({ error: 'state must be a two-letter US state code (50 states + DC)' });
    }
    state = code;
  }

  const existing = await ScamReportsModel.getReportById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Report not found' });
  if (state && (existing.country ?? 'US') !== 'US') {
    return res.status(400).json({ error: 'Only US reports can carry a state' });
  }

  const updated = await ScamReportsModel.updateReportState(req.params.id, state);
  res.json({ data: updated });
});
