import { AuthedRequest } from '../middleware/auth';
import * as StatsModel from '../models/stats';
import { asyncHandler } from '../utils/asyncHandler';

export const get = asyncHandler<AuthedRequest>(async (_req, res) => {
  const stats = await StatsModel.getSiteStats();
  res.json({ data: stats });
});

export const live = asyncHandler<AuthedRequest>(async (_req, res) => {
  const stats = await StatsModel.getLiveStats();
  res.json({ data: stats });
});

export const breakdown = asyncHandler<AuthedRequest>(async (_req, res) => {
  const data = await StatsModel.getStatsBreakdown();
  // Matches the in-process cache: browsers and CDNs may reuse it briefly.
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ data });
});
