import { AuthedRequest } from '../middleware/auth';
import * as UsersModel from '../models/users';
import * as AlertSubscriptionsModel from '../models/alertSubscriptions';
import * as CategoriesModel from '../models/categories';
import { asyncHandler } from '../utils/asyncHandler';
import {
  AlertFrequency,
  isFrequencyAllowedForTier,
  maxFrequencyForTier,
  maxWatchProfilesForTier,
} from '../config/alertTiers';

const VALID_FREQUENCIES: AlertFrequency[] = ['monthly', 'weekly', 'daily', 'instant'];
const STATE_RE = /^[A-Z]{2}$/;

// GET /alert-subscriptions/preferences — creates a default row (at the
// user's tier max) the first time they visit, rather than making the
// frontend special-case "no preferences yet". No email goes out from this
// alone: usersDueForDigest also requires at least one watch profile.
export const getPreferences = asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await UsersModel.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  let preferences = await AlertSubscriptionsModel.getPreferences(user.id);
  if (!preferences) {
    preferences = await AlertSubscriptionsModel.setFrequency(user.id, maxFrequencyForTier(user.subscription_tier));
  }
  res.json({ data: preferences, maxFrequency: maxFrequencyForTier(user.subscription_tier) });
});

export const updatePreferences = asyncHandler<AuthedRequest>(async (req, res) => {
  const { frequency } = req.body as { frequency?: string };
  if (!frequency || !VALID_FREQUENCIES.includes(frequency as AlertFrequency)) {
    return res.status(400).json({ error: `frequency must be one of: ${VALID_FREQUENCIES.join(', ')}` });
  }

  const user = await UsersModel.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!isFrequencyAllowedForTier(frequency as AlertFrequency, user.subscription_tier)) {
    return res.status(403).json({
      error: `Your plan allows up to "${maxFrequencyForTier(user.subscription_tier)}" alerts. Upgrade for more frequent delivery.`,
    });
  }

  const preferences = await AlertSubscriptionsModel.setFrequency(user.id, frequency as AlertFrequency);
  res.json({ data: preferences });
});

export const listWatchProfiles = asyncHandler<AuthedRequest>(async (req, res) => {
  const profiles = await AlertSubscriptionsModel.listWatchProfiles(req.user!.id);
  res.json({ data: profiles });
});

export const createWatchProfile = asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await UsersModel.getUserById(req.user!.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const maxProfiles = maxWatchProfilesForTier(user.subscription_tier);
  const currentCount = await AlertSubscriptionsModel.countWatchProfiles(user.id);
  if (currentCount >= maxProfiles) {
    return res.status(403).json({
      error:
        maxProfiles === 1
          ? 'Your plan supports one watch profile. Upgrade to Family or Business to cover more people or places.'
          : `Your plan supports up to ${maxProfiles} watch profiles.`,
    });
  }

  const { label, state, category } = req.body as { label?: string; state?: string; category?: string };

  if (state && !STATE_RE.test(state)) {
    return res.status(400).json({ error: 'state must be a 2-letter USPS code (e.g. "FL"), or omitted for nationwide' });
  }

  let categoryId: string | null = null;
  if (category) {
    const categoryRow = await CategoriesModel.getCategoryBySlug(category);
    if (!categoryRow) return res.status(400).json({ error: `Unknown category "${category}"` });
    categoryId = categoryRow.id;
  }

  const profile = await AlertSubscriptionsModel.createWatchProfile(user.id, {
    label: label ?? null,
    state: state ?? null,
    categoryId,
  });
  res.status(201).json({ data: profile });
});

export const deleteWatchProfile = asyncHandler<AuthedRequest>(async (req, res) => {
  const deleted = await AlertSubscriptionsModel.deleteWatchProfile(req.user!.id, req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Watch profile not found' });
  res.status(204).send();
});
