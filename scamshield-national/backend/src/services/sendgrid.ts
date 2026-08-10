// SendGrid email — spec section 5.3. Transactional sends only for now;
// marketing-campaign digest wiring lands in Phase 3.
import sgMail from '@sendgrid/mail';

let configured = false;

function ensureConfigured() {
  if (!configured) {
    const key = process.env.SENDGRID_API_KEY;
    if (!key) throw new Error('SENDGRID_API_KEY is not set');
    sgMail.setApiKey(key);
    configured = true;
  }
}

export async function sendTransactionalEmail(to: string, subject: string, html: string) {
  ensureConfigured();
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!from) throw new Error('SENDGRID_FROM_EMAIL is not set');
  await sgMail.send({ to, from, subject, html });
}

export async function sendWelcomeEmail(to: string) {
  return sendTransactionalEmail(to, 'Welcome to ScamShield National', '<p>Thanks for signing up.</p>');
}
