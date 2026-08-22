import { AuthedRequest } from '../middleware/auth';
import * as StatsModel from '../models/stats';
import { asyncHandler } from '../utils/asyncHandler';

export const get = asyncHandler<AuthedRequest>(async (_req, res) => {
  const stats = await StatsModel.getSiteStats();
  res.json({ data: stats });
});

export const breakdown = asyncHandler<AuthedRequest>(async (_req, res) => {
  const breakdown = await StatsModel.getStatsBreakdown();
  res.json({ data: breakdown });
});
