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
// Note on geographic targeting: detection currently aggregates across ALL
// reports nationwide (the underlying SQL doesn't group by state), so
// every candidate here is_nationwide=true. State-scoped detection would
// need scam_reports to reliably carry a state on each report first.
import 'dotenv/config';
import { pool } from '../db/connection';
import { DetectedPattern, detectAllPatterns } from '../services/patternDetection';
import * as alertCandidatesModel from '../models/alertCandidates';

function contactTypeLabel(contact: string): string {
  if (contact.includes('@')) return 'email address';
  if (/^[\d\s()+.-]{7,}$/.test(contact)) return 'phone number';
  return 'website';
}

function buildCandidate(pattern: DetectedPattern): alertCandidatesModel.NewAlertCandidate | null {
  const { input, dedupeTag } = pattern;

  if (input.kind === 'recurring_contact' && input.recurringContact) {
    const contact = input.recurringContact;
    const type = contactTypeLabel(contact);
    const approxCount = input.reportDescriptions.length;
    return {
      dedupe_tag: dedupeTag,
      title: `Recurring scam contact reported: ${contact}`,
      body: `The same ${type} — ${contact} — has now shown up in at least ${approxCount} separate scam reports over the past 60 days. If you've been contacted by this ${type}, don't send money, gift cards, or personal information. Report it at ScamShieldNational.com.`,
      alert_level: 'high',
      is_nationwide: true,
      pattern_type: 'recurring_contact',
    };
  }

  if (input.kind === 'category_spike' && input.categoryName) {
    return {
      dedupe_tag: dedupeTag,
      title: `Reports rising: ${input.categoryName}`,
      body: `Reports of ${input.categoryName} have risen to ${input.countLast30d} in the past 30 days, up from ${input.countPrior30d} the 30 days before that. If this matches something you've recently seen, learn the warning signs at ScamShieldNational.com.`,
      alert_level: 'medium',
      is_nationwide: true,
      pattern_type: 'category_spike',
    };
  }

  return null;
}

async function main() {
  const patterns = await detectAllPatterns();
  let queued = 0;

  for (const pattern of patterns) {
    const candidate = buildCandidate(pattern);
    if (!candidate) continue;
    const inserted = await alertCandidatesModel.insertCandidate(candidate);
    if (inserted) queued += 1;
  }

  console.log(`generateAlertCandidates: ${patterns.length} patterns detected, ${queued} new alert candidates queued for review`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
