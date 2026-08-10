import { NextFunction, Response } from 'express';
import { AuthedRequest } from './auth';
import * as UsersModel from '../models/users';

// Gates routes marked "Subscriber" in the API spec (section 3). Admins
// pass through regardless of tier.
export async function requireSubscriber(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Missing bearer token' });
  if (req.user.role === 'admin') return next();

  const user = await UsersModel.getUserById(req.user.id);
  if (!user || user.subscription_tier === 'free') {
    return res.status(403).json({ error: 'This endpoint requires an active subscription' });
  }
  next();
}
