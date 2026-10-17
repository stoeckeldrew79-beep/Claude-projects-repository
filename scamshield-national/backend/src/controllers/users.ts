import { AuthedRequest } from '../middleware/auth';
import * as UsersModel from '../models/users';
import { asyncHandler } from '../utils/asyncHandler';
import { resolveHomeArea } from '../utils/homeArea';
import { InvalidStateError } from '../utils/usStates';

export const me = asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await UsersModel.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: UsersModel.sanitizeUser(user) });
});

export const updateMe = asyncHandler<AuthedRequest>(async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const update: UsersModel.UserProfileUpdate = {};

  // Home ZIP/state decide which state alerts a subscriber gets, so they
  // are validated together (see utils/homeArea.ts) rather than stored as
  // whatever text arrived.
  try {
    const home = resolveHomeArea({ zip_code: body.zip_code, state: body.state });
    if (home) Object.assign(update, home);
  } catch (err) {
    if (err instanceof InvalidStateError) return res.status(400).json({ error: err.message });
    throw err;
  }

  if (body.email_opt_in !== undefined) {
    if (typeof body.email_opt_in !== 'boolean') return res.status(400).json({ error: 'email_opt_in must be true or false' });
    update.email_opt_in = body.email_opt_in;
  }
  if (body.phone !== undefined) {
    if (body.phone !== null && typeof body.phone !== 'string') return res.status(400).json({ error: 'phone must be a string' });
    update.phone = body.phone;
  }

  const user = await UsersModel.updateUserProfile(req.user!.id, update);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: UsersModel.sanitizeUser(user) });
});

export const smsOptIn = asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await UsersModel.setSmsOptIn(req.user!.id, true);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: UsersModel.sanitizeUser(user) });
});
