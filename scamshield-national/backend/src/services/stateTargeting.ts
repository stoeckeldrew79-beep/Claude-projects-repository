// Decides which detected patterns become state-targeted alert candidates.
// Kept free of database access so the rules can be unit-tested directly;
// generateAlertCandidates.ts does the querying and inserting.
//
// Switched off unless ALERTS_STATE_DETECTION=1, so turning it on (or back
// off) is a config change, not a deploy. Off, every candidate stays
// nationwide exactly as before.
import type { DetectedPattern } from './patternDetection';
import { isUsStateCode, UsStateCode } from '../utils/usStates';

export function isStateDetectionEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const value = (env.ALERTS_STATE_DETECTION ?? '').trim().toLowerCase();
  return value === '1' || value === 'true';
}

// A recurring contact is localized to one state only when the evidence
// clearly points there: at least 2 reports name a state, every one of
// them names the same state, and those reports are at least half of all
// the contact's reports. Anything weaker stays nationwide — a scammer's
// number showing up in two states is exactly what everyone should hear about.
export const MIN_LOCALIZED_CONTACT_REPORTS = 2;

export function localizeContact(totalReports: number, reportStates: string[]): UsStateCode | null {
  if (reportStates.length < MIN_LOCALIZED_CONTACT_REPORTS) return null;
  const distinct = new Set(reportStates);
  if (distinct.size !== 1) return null;
  if (reportStates.length * 2 < totalReports) return null;
  const [state] = distinct;
  return isUsStateCode(state) ? state : null;
}

export interface PlannedAlert {
  pattern: DetectedPattern;
  // null = nationwide.
  state: UsStateCode | null;
  dedupeTag: string;
}

// national: detectAllPatterns() output. stateSpikes: detectStateCategorySpikes()
// output. existingTags: dedupe tags of `national` already in alert_candidates.
export function planAlerts(
  national: DetectedPattern[],
  stateSpikes: DetectedPattern[],
  existingTags: Set<string>
): PlannedAlert[] {
  const planned: PlannedAlert[] = [];

  for (const pattern of national) {
    const contact = pattern.input.recurringContact;
    // A contact already queued (or sent, or dismissed) as a nationwide
    // alert keeps its nationwide tag, which the insert then skips as a
    // duplicate — otherwise switching this feature on would re-alert
    // every known contact a second time, scoped to a state.
    const state =
      pattern.input.kind === 'recurring_contact' && contact && !existingTags.has(pattern.dedupeTag)
        ? localizeContact(pattern.reportCount ?? pattern.input.reportDescriptions.length, pattern.reportStates ?? [])
        : null;
    planned.push(
      state
        ? { pattern, state, dedupeTag: `pattern:contact:${state}:${contact}` }
        : { pattern, state: null, dedupeTag: pattern.dedupeTag }
    );
  }

  // A category already spiking nationally gets the nationwide alert, which
  // reaches that state's subscribers too; a second, state-only alert for
  // the same thing would just be a duplicate in their inbox.
  const nationalSpikes = new Set(
    national.filter((p) => p.input.kind === 'category_spike').map((p) => p.input.categoryName)
  );
  for (const pattern of stateSpikes) {
    if (!pattern.state || !isUsStateCode(pattern.state)) continue;
    if (nationalSpikes.has(pattern.input.categoryName)) continue;
    planned.push({ pattern, state: pattern.state, dedupeTag: pattern.dedupeTag });
  }

  return planned;
}
