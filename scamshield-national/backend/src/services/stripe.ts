// Stripe integration — spec section 5.1. Lazily constructs the client so
// the app can boot in Phase 1 before STRIPE_SECRET_KEY is configured.
import Stripe from 'stripe';
import { isSubscriptionTier, lookupKey, PLAN_PRICES, tierForLookupKey, SubscriptionTier } from '../config/stripePrices';
import { pool } from '../db/connection';
import * as SubscriptionsModel from '../models/subscriptions';

let client: Stripe | null = null;

function getClient(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    client = new Stripe(key);
  }
  return client;
}

const priceCache = new Map<SubscriptionTier, string>();

async function findPrice(stripe: Stripe, key: string): Promise<string | null> {
  const { data } = await stripe.prices.list({ lookup_keys: [key], active: true, limit: 1 });
  return data[0]?.id ?? null;
}

export async function priceForTier(tier: SubscriptionTier): Promise<string> {
  const cached = priceCache.get(tier);
  if (cached) return cached;
  const stripe = getClient();
  const key = lookupKey(tier);
  let id = await findPrice(stripe, key);
  if (!id) {
    try {
      const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: PLAN_PRICES[tier].cents,
        recurring: { interval: 'month' },
        lookup_key: key,
        product_data: { name: PLAN_PRICES[tier].name, metadata: { tier } },
        metadata: { tier },
      });
      id = price.id;
      console.log(`stripe: created ${PLAN_PRICES[tier].name} price ${id} ($${(PLAN_PRICES[tier].cents / 100).toFixed(2)}/month)`);
    } catch (err) {
      // Another instance created it first: lookup keys are unique.
      id = await findPrice(stripe, key);
      if (!id) throw err;
    }
  }
  priceCache.set(tier, id);
  return id;
}

// Run once at startup so the prices exist in Stripe (and show in its
// dashboard) before the first checkout. A no-op without a Stripe key.
export async function ensureStripePrices(): Promise<void> {
  if (!process.env.STRIPE_SECRET_KEY) return;
  for (const tier of Object.keys(PLAN_PRICES) as SubscriptionTier[]) {
    try {
      await priceForTier(tier);
    } catch (err) {
      console.error(`stripe: could not set up the ${tier} price: ${(err as Error).message}`);
    }
  }
}

export async function createCheckoutSession(userId: string, tier: SubscriptionTier) {
  const stripe = getClient();
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: await priceForTier(tier), quantity: 1 }],
    client_reference_id: userId,
    // The plan rides on the subscription itself, so the webhook knows the
    // tier even after prices change and this price ID is no longer in env.
    subscription_data: { metadata: { tier } },
    success_url: `${process.env.FRONTEND_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.FRONTEND_URL}/subscribe?checkout=canceled`,
  });
}

export async function createPortalSession(customerId: string) {
  const stripe = getClient();
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}/dashboard`,
  });
}

// --- Webhook endpoint -------------------------------------------------
// The server registers its own webhook with Stripe, so the only setting
// the owner ever enters is STRIPE_SECRET_KEY. Stripe reveals an endpoint's
// signing secret only when the endpoint is created, so it is kept in
// ingest_state; STRIPE_WEBHOOK_SECRET, if set, still takes precedence.
const WEBHOOK_EVENTS: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_failed',
];
const STATE_WEBHOOK_ID = 'stripe_webhook_id';
const STATE_WEBHOOK_SECRET = 'stripe_webhook_secret';
let webhookSecretCache: string | null = null;

async function getState(name: string): Promise<string | null> {
  const { rows } = await pool.query<{ value: string }>('SELECT value FROM ingest_state WHERE name = $1', [name]);
  return rows[0]?.value ?? null;
}

async function setState(name: string, value: string): Promise<void> {
  await pool.query(
    `INSERT INTO ingest_state (name, value) VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE SET value = $2, updated_at = NOW()`,
    [name, value]
  );
}

function webhookUrl(): string | null {
  // Render sets RENDER_EXTERNAL_URL on every web service.
  const base = process.env.PUBLIC_API_URL ?? process.env.RENDER_EXTERNAL_URL;
  return base ? `${base.replace(/\/+$/, '')}/v1/subscriptions/webhook` : null;
}

export async function ensureStripeWebhook(): Promise<void> {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_WEBHOOK_SECRET) return;
  const url = webhookUrl();
  if (!url) {
    console.error('stripe: no public URL (RENDER_EXTERNAL_URL / PUBLIC_API_URL) to register the webhook at');
    return;
  }
  const stripe = getClient();
  const [savedId, savedSecret] = [await getState(STATE_WEBHOOK_ID), await getState(STATE_WEBHOOK_SECRET)];
  const existing = await stripe.webhookEndpoints.list({ limit: 100 });
  const ours = existing.data.filter((e) => e.url === url);
  if (savedId && savedSecret && ours.some((e) => e.id === savedId && e.status === 'enabled')) {
    webhookSecretCache = savedSecret;
    return;
  }
  // An endpoint at our URL whose secret we don't hold can't be verified —
  // replace it rather than leave payments unsynced.
  for (const e of ours) await stripe.webhookEndpoints.del(e.id);
  const created = await stripe.webhookEndpoints.create({ url, enabled_events: WEBHOOK_EVENTS });
  if (!created.secret) throw new Error('Stripe did not return a webhook signing secret');
  await setState(STATE_WEBHOOK_SECRET, created.secret);
  await setState(STATE_WEBHOOK_ID, created.id);
  webhookSecretCache = created.secret;
  console.log(`stripe: registered webhook ${created.id} at ${url}`);
}

async function webhookSecret(): Promise<string> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? webhookSecretCache ?? (await getState(STATE_WEBHOOK_SECRET));
  if (!secret) throw new Error('No Stripe webhook secret yet');
  webhookSecretCache = secret;
  return secret;
}

// Verifies the raw request body against the webhook's signing secret. Must
// be called with the *unparsed* body — see index.ts, which mounts this
// route with express.raw() ahead of the global express.json().
export async function constructWebhookEvent(rawBody: Buffer, signature: string): Promise<Stripe.Event> {
  const secret = await webhookSecret();
  const stripe = getClient();
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

// Everything the server sets up in Stripe by itself at startup.
export async function setUpStripe(): Promise<void> {
  if (!process.env.STRIPE_SECRET_KEY) return;
  await ensureStripePrices();
  try {
    await ensureStripeWebhook();
  } catch (err) {
    console.error(`stripe: could not register the webhook: ${(err as Error).message}`);
  }
}

function tierFromSubscription(sub: Stripe.Subscription): string {
  const fromMetadata = sub.metadata?.tier;
  if (isSubscriptionTier(fromMetadata)) return fromMetadata;
  return tierForLookupKey(sub.items.data[0]?.price?.lookup_key) ?? 'basic';
}

// Stripe stops retrying a failed payment and marks the subscription one of
// these; alerts stop with it. past_due is left alone — that is Stripe's
// retry window, and a card that goes through on retry shouldn't have cut
// anyone off.
const ENDED_STATUSES = new Set(['unpaid', 'canceled', 'incomplete_expired']);

export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const customerId = session.customer as string | null;
      if (userId && customerId) {
        await SubscriptionsModel.linkStripeCustomer(userId, customerId);
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const sub = event.data.object as Stripe.Subscription;
      const user = await SubscriptionsModel.getUserByStripeCustomerId(sub.customer as string);
      if (!user) break;
      const tier = tierFromSubscription(sub);
      await SubscriptionsModel.upsertSubscription({
        userId: user.id,
        stripeSubscriptionId: sub.id,
        tier,
        status: sub.status,
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
      });
      if (sub.status === 'active' || sub.status === 'trialing') {
        await SubscriptionsModel.setUserTier(user.id, tier);
      } else if (ENDED_STATUSES.has(sub.status)) {
        await SubscriptionsModel.setUserTier(user.id, 'free');
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const user = await SubscriptionsModel.getUserByStripeCustomerId(sub.customer as string);
      if (!user) break;
      await SubscriptionsModel.markSubscriptionStatus(sub.id, 'canceled');
      await SubscriptionsModel.setUserTier(user.id, 'free');
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = invoice.subscription as string | null;
      if (subId) {
        await SubscriptionsModel.markSubscriptionStatus(subId, 'past_due');
      }
      break;
    }

    default:
      break;
  }
}
