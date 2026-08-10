// SendGrid email — spec section 5.3. Real-time transactional sends here;
// the monthly digest (Marketing Campaigns, dynamic templates) is a
// separate periodic job, not part of this real-time broadcast path.
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
  // All emails must include an unsubscribe link (CAN-SPAM) — SendGrid's
  // subscription tracking injects this automatically when enabled on the
  // sender identity; not re-implemented here.
  await sgMail.send({ to, from, subject, html });
}

export async function sendWelcomeEmail(to: string) {
  return sendTransactionalEmail(to, 'Welcome to ScamShield National', '<p>Thanks for signing up.</p>');
}

export function alertEmailHtml(title: string, body: string): string {
  return `<h2>${title}</h2><p>${body}</p>`;
}

export async function sendAlertEmails(recipients: { id: string; email: string }[], title: string, body: string) {
  const html = alertEmailHtml(title, body);
  await Promise.all(recipients.map((r) => sendTransactionalEmail(r.email, `Alert: ${title}`, html)));
}
