import { AuthedRequest } from '../middleware/auth';
import * as UsersModel from '../models/users';
import { asyncHandler } from '../utils/asyncHandler';

export const me = asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await UsersModel.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: UsersModel.sanitizeUser(user) });
});

export const updateMe = asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await UsersModel.updateUserProfile(req.user!.id, req.body);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: UsersModel.sanitizeUser(user) });
});

export const smsOptIn = asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await UsersModel.setSmsOptIn(req.user!.id, true);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: UsersModel.sanitizeUser(user) });
});
