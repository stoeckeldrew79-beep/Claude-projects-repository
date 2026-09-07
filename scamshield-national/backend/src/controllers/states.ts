import { AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as StatesModel from '../models/states';

export const list = asyncHandler<AuthedRequest>(async (_req, res) => {
  res.json({ data: await StatesModel.listStates() });
});

export const getBySlug = asyncHandler<AuthedRequest>(async (req, res) => {
  const state = await StatesModel.getStateBySlug(req.params.slug.toLowerCase());
  if (!state) return res.status(404).json({ error: 'State not found' });
  res.json({ data: state });
});
