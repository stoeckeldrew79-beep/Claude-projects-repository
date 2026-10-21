// Run daily (via system cron / hosting-platform scheduler — see README,
// alongside draft-articles and scan-daily-news) to turn the same pattern
// detection generateDailyDrafts.ts uses into short, SMS/email-length
// alert candidates. Every candidate lands in the admin review queue
// (alert_candidates, status='pending') — nothing texts or emails a real
// subscriber until a human approves it via POST /alert-candidates/:id/approve,
// which is what actually creates the `alerts` row and fires broadcastAlert.
//
// Deliberately template-based rather than AI-drafted: this text goes out
// as a real SMS/email to real people within seconds of admin approval, so
// it's built directly from the same verified counts/contacts the detector
// found — no model call, nothing to hallucinate.
//
// Geographic targeting: off by default, every candidate is nationwide.
// With ALERTS_STATE_DETECTION=1 (see services/stateTargeting.ts), a
// recurring contact whose reports all come from one state is targeted to
// that state, and a category spiking in one state but not nationally gets
// a state-only candidate. Both still go through the same admin review.
import 'dotenv/config';
import { pool } from '../db/connection';
import { DetectedPattern, detectAllPatterns, detectStateCategorySpikes } from '../services/patternDetection';
import { isStateDetectionEnabled, PlannedAlert, planAlerts } from '../services/stateTargeting';
import * as alertCandidatesModel from '../models/alertCandidates';
import { US_STATE_NAMES } from '../utils/usStates';

function contactTypeLabel(contact: string): string {
  if (contact.includes('@')) return 'email address';
  if (/^[\d\s()+.-]{7,}$/.test(contact)) return 'phone number';
  return 'website';
}

export function buildCandidate({ pattern, state, dedupeTag }: PlannedAlert): alertCandidatesModel.NewAlertCandidate | null {
  const { input } = pattern;
  const place = state ? US_STATE_NAMES[state] : null;
  const targeting = { state, is_nationwide: state === null };

  if (input.kind === 'recurring_contact' && input.recurringContact) {
    const contact = input.recurringContact;
    const type = contactTypeLabel(contact);
    const approxCount = pattern.reportCount ?? input.reportDescriptions.length;
    return {
      dedupe_tag: dedupeTag,
      title: place
        ? `Recurring scam contact reported in ${place}: ${contact}`
        : `Recurring scam contact reported: ${contact}`,
      body: `The same ${type} — ${contact} — has now shown up in at least ${approxCount} separate scam reports over the past 60 days${place ? `, concentrated in ${place}` : ''}. If you've been contacted by this ${type}, don't send money, gift cards, or personal information. Report it at ScamTitan.com.`,
      alert_level: 'high',
      ...targeting,
      pattern_type: 'recurring_contact',
    };
  }

  if (input.kind === 'category_spike' && input.categoryName) {
    return {
      dedupe_tag: dedupeTag,
      title: place ? `Reports rising in ${place}: ${input.categoryName}` : `Reports rising: ${input.categoryName}`,
      body: `Reports of ${input.categoryName}${place ? ` in ${place}` : ''} have risen to ${input.countLast30d} in the past 30 days, up from ${input.countPrior30d} the 30 days before that. If this matches something you've recently seen, learn the warning signs at ScamTitan.com.`,
      alert_level: 'medium',
      ...targeting,
      pattern_type: 'category_spike',
    };
  }

  return null;
}

async function planFromDatabase(): Promise<PlannedAlert[]> {
  const national = await detectAllPatterns();
  if (!isStateDetectionEnabled()) {
    return national.map((pattern: DetectedPattern) => ({ pattern, state: null, dedupeTag: pattern.dedupeTag }));
  }
  const stateSpikes = await detectStateCategorySpikes();
  const existing = await alertCandidatesModel.existingTags(national.map((p) => p.dedupeTag));
  return planAlerts(national, stateSpikes, existing);
}

async function main() {
  const planned = await planFromDatabase();
  let queued = 0;

  for (const plan of planned) {
    const candidate = buildCandidate(plan);
    if (!candidate) continue;
    const inserted = await alertCandidatesModel.insertCandidate(candidate);
    if (inserted) queued += 1;
  }

  const stateScoped = planned.filter((p) => p.state).length;
  console.log(
    `generateAlertCandidates: ${planned.length} patterns detected (${stateScoped} state-targeted; state detection ${isStateDetectionEnabled() ? 'on' : 'off'}), ${queued} new alert candidates queued for review`
  );
  await pool.end();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
