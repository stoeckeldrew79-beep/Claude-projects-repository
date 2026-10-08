// Run on a schedule per frequency (see README) — this is the periodic job
// spec section 5.3 anticipated for Basic ("digest-only, handled separately
// by a periodic job, not this real-time broadcast") and this file extends
// the same idea to every tier (Free=monthly, Basic=weekly, Pro=daily,
// Family/Business=instant), separately from the admin-curated early-warning
// `alerts`/`alert_candidates` pipeline (generateAlertCandidates.ts), which
// stays untouched. This job sends ordinary newly-documented scams matching
// a subscriber's own watch profiles — the "live feed" of the database
// itself, not pattern-detected early warnings.
//
// One shot, not a long-running process, same as draft-articles/
// scan-daily-news/detect-alerts — schedule it per frequency, e.g.:
//   0 7 1 * *  npm run send-alert-digests -- --frequency=monthly
//   0 7 * * 1  npm run send-alert-digests -- --frequency=weekly
//   0 7 * * *  npm run send-alert-digests -- --frequency=daily
//   */20 * * * * npm run send-alert-digests -- --frequency=instant
import 'dotenv/config';
import { pool } from '../db/connection';
import * as AlertSubscriptionsModel from '../models/alertSubscriptions';
import * as sendgridService from '../services/sendgrid';
import { AlertFrequency } from '../config/alertTiers';

const VALID_FREQUENCIES: AlertFrequency[] = ['monthly', 'weekly', 'daily', 'instant'];
const WINDOW_DAYS: Record<AlertFrequency, number> = { monthly: 31, weekly: 7, daily: 1, instant: 1 };

function parseFrequency(): AlertFrequency {
  const arg = process.argv.find((a) => a.startsWith('--frequency='));
  const value = arg?.split('=')[1];
  if (!value || !VALID_FREQUENCIES.includes(value as AlertFrequency)) {
    throw new Error(`--frequency=<${VALID_FREQUENCIES.join('|')}> is required`);
  }
  return value as AlertFrequency;
}

// A subscriber with no prior send (just set their preference, or this is
// the job's first-ever run for their cadence) gets this frequency's own
// window, not the full historical backlog — a new monthly subscriber
// shouldn't receive years of scams in one email.
function defaultWindowStart(frequency: AlertFrequency): Date {
  return new Date(Date.now() - WINDOW_DAYS[frequency] * 24 * 60 * 60 * 1000);
}

async function main() {
  const frequency = parseFrequency();
  const users = await AlertSubscriptionsModel.usersDueForDigest(frequency);

  let sent = 0;
  let skippedEmpty = 0;
  const errors: string[] = [];

  // Sequential, not Promise.all — this hits SendGrid's rate limits and
  // the DB once per subscriber; a digest job has no latency requirement
  // the way a request handler does, so simplicity wins over throughput.
  for (const user of users) {
    try {
      const preferences = await AlertSubscriptionsModel.getPreferences(user.id);
      const since = preferences?.last_sent_at ? new Date(preferences.last_sent_at) : defaultWindowStart(frequency);
      const matches = await AlertSubscriptionsModel.findNewMatchesForUser(user.id, since);

      if (matches.length === 0) {
        skippedEmpty += 1;
        continue;
      }

      await sendgridService.sendDigestEmail(user.email, matches, frequency);
      await AlertSubscriptionsModel.markSent(user.id);
      sent += 1;
    } catch (err) {
      errors.push(`${user.id}: ${(err as Error).message}`);
    }
  }

  console.log(
    `sendAlertDigests (${frequency}): ${users.length} subscribers due, ${sent} emails sent, ${skippedEmpty} had nothing new${errors.length ? `, ${errors.length} failed` : ''}`
  );
  if (errors.length > 0) console.error(errors.join('\n'));

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
