import { AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as globalSourcesModel from '../models/globalSources';

export const list = asyncHandler<AuthedRequest>(async (_req, res) => {
  const sources = await globalSourcesModel.listSourcesWithStats();
  res.json({ data: sources });
});

export const createStat = asyncHandler<AuthedRequest>(async (req, res) => {
  const { source_id, period_label, headline, report_count, loss_amount, currency, top_category, source_url, published_date } =
    req.body;
  if (!source_id || !period_label || !headline || !source_url) {
    return res.status(400).json({ error: 'source_id, period_label, headline, and source_url are required' });
  }
  const stat = await globalSourcesModel.createStat({
    source_id,
    period_label,
    headline,
    report_count,
    loss_amount,
    currency,
    top_category,
    source_url,
    published_date,
  });
  res.status(201).json({ data: stat });
});

export const removeStat = asyncHandler<AuthedRequest>(async (req, res) => {
  const deleted = await globalSourcesModel.deleteStat(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Stat not found' });
  res.status(204).send();
});
