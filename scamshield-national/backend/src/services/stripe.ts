// Stripe integration — spec section 5.1. Lazily constructs the client so
// the app can boot in Phase 1 before STRIPE_SECRET_KEY is configured.
import Stripe from 'stripe';

let client: Stripe | null = null;

function getClient(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    client = new Stripe(key);
  }
  return client;
}

export async function createCheckoutSession(userId: string, priceId: string) {
  const stripe = getClient();
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
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

export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed':
      // TODO(Phase 2): sync subscriptions table from event.data.object
      break;
    default:
      break;
  }
}
