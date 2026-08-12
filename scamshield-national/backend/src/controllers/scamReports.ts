import { AuthedRequest } from '../middleware/auth';
import * as ScamReportsModel from '../models/scamReports';
import * as ScamsModel from '../models/scams';
import { asyncHandler } from '../utils/asyncHandler';

export const create = asyncHandler<AuthedRequest>(async (req, res) => {
  const { description } = req.body as { description?: string };
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ error: 'description is required (at least 10 characters)' });
  }
  const report = await ScamReportsModel.createReport(req.body);
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

export const dismiss = asyncHandler<AuthedRequest>(async (req, res) => {
  const updated = await ScamReportsModel.updateReportReview(req.params.id, {
    status: 'dismissed',
    reviewed_by: req.user!.id,
    reviewed_at: new Date(),
  });
  if (!updated) return res.status(404).json({ error: 'Report not found' });
  res.json({ data: updated });
});
