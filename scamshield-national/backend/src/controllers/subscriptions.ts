import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import * as stripeService from '../services/stripe';

// Real Stripe wiring lands in Phase 2 (spec section 5.1). These handlers
// define the API surface and DB reads/writes; stripeService is a stub
// until STRIPE_SECRET_KEY is configured.

export async function checkout(req: AuthedRequest, res: Response) {
  const { priceId } = req.body as { priceId?: string };
  if (!priceId) return res.status(400).json({ error: 'priceId is required' });
  const session = await stripeService.createCheckoutSession(req.user!.id, priceId);
  res.json({ data: session });
}

export async function portal(req: AuthedRequest, res: Response) {
  const session = await stripeService.createPortalSession(req.user!.id);
  res.json({ data: session });
}

export async function webhook(req: AuthedRequest, res: Response) {
  await stripeService.handleWebhookEvent(req.body);
  res.status(200).json({ received: true });
}

export async function status(req: AuthedRequest, res: Response) {
  const { rows } = await pool.query(
    'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
    [req.user!.id]
  );
  res.json({ data: rows[0] ?? null });
}
