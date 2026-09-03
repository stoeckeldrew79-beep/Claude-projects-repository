import { AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as stateAgSourcesModel from '../models/stateAgSources';

export const list = asyncHandler<AuthedRequest>(async (_req, res) => {
  const sources = await stateAgSourcesModel.listStateAgSources();
  res.json({ data: sources });
});
