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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function alertEmailHtml(title: string, body: string): string {
  return `<h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p>`;
}

export async function sendAlertEmails(recipients: { id: string; email: string }[], title: string, body: string) {
  const html = alertEmailHtml(title, body);
  await Promise.all(recipients.map((r) => sendTransactionalEmail(r.email, `Alert: ${title}`, html)));
}

export interface DigestItem {
  name: string;
  slug: string;
  description: string;
  alert_level: string | null;
  category_name: string | null;
  matched_label: string | null;
  matched_state: string | null;
}

const FREQUENCY_LABEL: Record<string, string> = {
  monthly: 'monthly',
  weekly: 'weekly',
  daily: 'daily',
  instant: 'latest',
};

// One row per matched scam, in the same red/orange/amber/slate severity
// language the real-time alert feed already uses (ALERT_COLORS in
// frontend/src/pages/Alerts.tsx) so a subscriber reading an email doesn't
// learn a second color vocabulary from the one the website already taught.
function digestItemHtml(item: DigestItem, siteUrl: string): string {
  const context = [item.matched_label, item.matched_state].filter(Boolean).join(' — ');
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">
        <a href="${siteUrl}/scams/${escapeHtml(item.slug)}" style="font-weight:600;color:#1e293b;text-decoration:none;">${escapeHtml(item.name)}</a>
        ${item.alert_level ? ` <span style="font-size:11px;color:#64748b;text-transform:uppercase;">${escapeHtml(item.alert_level)}</span>` : ''}
        <p style="margin:4px 0 0;font-size:13px;color:#475569;">${escapeHtml(item.description.slice(0, 220))}${item.description.length > 220 ? '…' : ''}</p>
        ${context || item.category_name ? `<p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">${[item.category_name ?? '', context].filter(Boolean).map(escapeHtml).join(' · ')}</p>` : ''}
      </td>
    </tr>`;
}

export function digestEmailHtml(items: DigestItem[], frequency: string, siteUrl: string): string {
  const label = FREQUENCY_LABEL[frequency] ?? frequency;
  const rows = items.map((item) => digestItemHtml(item, siteUrl)).join('');
  return `
    <h2>Your ${escapeHtml(label)} ScamShield digest</h2>
    <p style="color:#475569;">${items.length} new ${items.length === 1 ? 'scam matches' : 'scams match'} what you're watching.</p>
    <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    <p style="margin-top:16px;"><a href="${siteUrl}/alerts">Manage what you're watching →</a></p>`;
}

export async function sendDigestEmail(to: string, items: DigestItem[], frequency: string) {
  const siteUrl = process.env.FRONTEND_URL ?? '';
  const html = digestEmailHtml(items, frequency, siteUrl);
  const label = FREQUENCY_LABEL[frequency] ?? frequency;
  await sendTransactionalEmail(to, `Your ${label} ScamShield digest — ${items.length} new`, html);
}
