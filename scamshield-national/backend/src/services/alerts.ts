// Alert broadcast orchestration — spec section 7, Phase 3.
// Wires the alerts table to the Twilio/SendGrid fan-out once an alert
// is created; not yet called from controllers/alerts.ts.
import * as UsersModel from '../models/users';
import * as twilioService from './twilio';

export async function broadcastAlert(alert: {
  title: string;
  body: string;
  state: string | null;
  zip_code: string | null;
  is_nationwide: boolean;
}) {
  const recipients = await UsersModel.usersForAlert({
    state: alert.state ?? undefined,
    zip: alert.zip_code ?? undefined,
    nationwide: alert.is_nationwide,
  });

  const withPhone = recipients.filter((r): r is { id: string; phone: string } => Boolean(r.phone));
  if (withPhone.length > 0) {
    await twilioService.sendAlertSms(withPhone, `${alert.title}: ${alert.body}`);
  }
}
