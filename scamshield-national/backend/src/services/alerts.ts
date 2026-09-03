// Alert broadcast orchestration — spec section 7, Phase 3.
// Called from controllers/alerts.ts after an alert row is inserted.
import * as UsersModel from '../models/users';
import * as twilioService from './twilio';
import * as sendgridService from './sendgrid';

export interface BroadcastableAlert {
  title: string;
  body: string;
  state: string | null;
  zip_code: string | null;
  is_nationwide: boolean;
}

export interface BroadcastResult {
  smsSent: number;
  emailsSent: number;
  errors: string[];
}

// SMS/email failures must never take down alert creation — the alert
// itself is already persisted by the time this runs. Each channel is
// isolated so one provider being unconfigured doesn't block the other.
export async function broadcastAlert(alert: BroadcastableAlert): Promise<BroadcastResult> {
  const errors: string[] = [];
  const targeting = { state: alert.state ?? undefined, zip: alert.zip_code ?? undefined, nationwide: alert.is_nationwide };

  let smsSent = 0;
  try {
    const smsRecipients = await UsersModel.usersForAlertSms(targeting);
    const withPhone = smsRecipients.filter((r): r is { id: string; phone: string } => Boolean(r.phone));
    if (withPhone.length > 0) {
      await twilioService.sendAlertSms(withPhone, `${alert.title}: ${alert.body}`);
    }
    smsSent = withPhone.length;
  } catch (err) {
    errors.push(`sms: ${(err as Error).message}`);
  }

  let emailsSent = 0;
  try {
    const emailRecipients = await UsersModel.usersForAlertEmail(targeting);
    if (emailRecipients.length > 0) {
      await sendgridService.sendAlertEmails(emailRecipients, alert.title, alert.body);
    }
    emailsSent = emailRecipients.length;
  } catch (err) {
    errors.push(`email: ${(err as Error).message}`);
  }

  return { smsSent, emailsSent, errors };
}
