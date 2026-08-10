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

const CHUNK_SIZE = 100;

export async function sendAlertSms(recipients: { id: string; phone: string }[], body: string) {
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) throw new Error('TWILIO_PHONE_NUMBER is not set');
  const smsClient = getClient();
  const fullBody = `${body}\n\nReply STOP to unsubscribe.`;

  for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
    const chunk = recipients.slice(i, i + CHUNK_SIZE);
    await Promise.all(chunk.map((r) => smsClient.messages.create({ to: r.phone, from, body: fullBody })));
  }
}
