// Stripe integration — spec section 5.1. Lazily constructs the client so
// the app can boot in Phase 1 before STRIPE_SECRET_KEY is configured.
import Stripe from 'stripe';
import { priceIdForTier, tierForPriceId, SubscriptionTier } from '../config/stripePrices';
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

export async function createCheckoutSession(userId: string, tier: SubscriptionTier) {
  const stripe = getClient();
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceIdForTier(tier), quantity: 1 }],
    client_reference_id: userId,
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

// Verifies the raw request body against STRIPE_WEBHOOK_SECRET. Must be
// called with the *unparsed* body — see index.ts, which mounts this
// route with express.raw() ahead of the global express.json().
export function constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  const stripe = getClient();
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

function tierFromSubscription(sub: Stripe.Subscription): string {
  const priceId = sub.items.data[0]?.price?.id;
  return (priceId && tierForPriceId(priceId)) ?? 'basic';
}

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
