import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import * as UsersModel from '../models/users';

export async function me(req: AuthedRequest, res: Response) {
  const user = await UsersModel.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user });
}

export async function updateMe(req: AuthedRequest, res: Response) {
  const user = await UsersModel.updateUserProfile(req.user!.id, req.body);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user });
}

export async function smsOptIn(req: AuthedRequest, res: Response) {
  const user = await UsersModel.setSmsOptIn(req.user!.id, true);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user });
}
