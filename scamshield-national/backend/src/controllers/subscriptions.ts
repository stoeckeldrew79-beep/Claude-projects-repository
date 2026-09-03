import { AuthedRequest } from '../middleware/auth';
import * as SubscriptionsModel from '../models/subscriptions';
import * as UsersModel from '../models/users';
import * as stripeService from '../services/stripe';
import { SubscriptionTier, TIER_PRICE_ENV } from '../config/stripePrices';
import { asyncHandler } from '../utils/asyncHandler';

export const checkout = asyncHandler<AuthedRequest>(async (req, res) => {
  const { tier } = req.body as { tier?: SubscriptionTier };
  if (!tier || !(tier in TIER_PRICE_ENV)) {
    return res.status(400).json({ error: `tier must be one of: ${Object.keys(TIER_PRICE_ENV).join(', ')}` });
  }
  const session = await stripeService.createCheckoutSession(req.user!.id, tier);
  res.json({ data: { url: session.url } });
});

export const portal = asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await UsersModel.getUserById(req.user!.id);
  if (!user?.stripe_customer_id) {
    return res.status(400).json({ error: 'No billing account on file yet — subscribe first' });
  }
  const session = await stripeService.createPortalSession(user.stripe_customer_id);
  res.json({ data: { url: session.url } });
});

// Mounted with express.raw() in index.ts so req.body is the raw Buffer
// Stripe's signature check requires.
export const webhook = asyncHandler<AuthedRequest>(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  if (typeof signature !== 'string') {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event;
  try {
    event = stripeService.constructWebhookEvent(req.body as Buffer, signature);
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${(err as Error).message}` });
  }

  await stripeService.handleWebhookEvent(event);
  res.status(200).json({ received: true });
});

export const status = asyncHandler<AuthedRequest>(async (req, res) => {
  const subscription = await SubscriptionsModel.latestForUser(req.user!.id);
  res.json({ data: subscription });
});
