// Twilio SMS — spec section 5.2. Batches sends in chunks of 100 and
// always appends opt-out instructions per TCPA compliance.
import twilio from 'twilio';

let client: ReturnType<typeof twilio> | null = null;

function getClient() {
  if (!client) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) throw new Error('Twilio credentials are not set');
    client = twilio(sid, token);
  }
  return client;
}

export const CHUNK_SIZE = 100;

// Pure — no network, no client — so it's unit-testable without live
// Twilio credentials.
export function chunkRecipients<T>(recipients: T[], size = CHUNK_SIZE): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < recipients.length; i += size) {
    chunks.push(recipients.slice(i, i + size));
  }
  return chunks;
}

export function withOptOutFooter(body: string): string {
  return `${body}\n\nReply STOP to unsubscribe.`;
}

export async function sendAlertSms(recipients: { id: string; phone: string }[], body: string) {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) throw new Error('TWILIO_PHONE_NUMBER is not set');
  const smsClient = getClient();
  const fullBody = withOptOutFooter(body);

  for (const chunk of chunkRecipients(recipients)) {
    await Promise.all(chunk.map((r) => smsClient.messages.create({ to: r.phone, from, body: fullBody })));
  }
}
