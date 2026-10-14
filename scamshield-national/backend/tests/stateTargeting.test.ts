// generateAlertCandidates imports the DB pool at module load; stub it so
// buildCandidate can be tested without a database.
jest.mock('../src/db/connection', () => ({ pool: {} }));

import type { DetectedPattern } from '../src/services/patternDetection';
import { isStateDetectionEnabled, localizeContact, planAlerts } from '../src/services/stateTargeting';
import { buildCandidate } from '../src/jobs/generateAlertCandidates';

function contact(value: string, states: string[], count = states.length): DetectedPattern {
  return {
    input: { kind: 'recurring_contact', recurringContact: value, reportDescriptions: Array(Math.min(count, 8)).fill('x') },
    dedupeTag: `pattern:contact:${value}`,
    reportStates: states,
    reportCount: count,
  };
}

function spike(category: string, state?: string): DetectedPattern {
  return {
    input: { kind: 'category_spike', categoryName: category, countLast30d: 6, countPrior30d: 2, reportDescriptions: [] },
    dedupeTag: state ? `pattern:category:${category}:${state}:2026-10` : `pattern:category:${category}:2026-10`,
    state,
  };
}

describe('isStateDetectionEnabled', () => {
  test('off unless explicitly switched on', () => {
    expect(isStateDetectionEnabled({})).toBe(false);
    expect(isStateDetectionEnabled({ ALERTS_STATE_DETECTION: '' })).toBe(false);
    expect(isStateDetectionEnabled({ ALERTS_STATE_DETECTION: '0' })).toBe(false);
    expect(isStateDetectionEnabled({ ALERTS_STATE_DETECTION: 'false' })).toBe(false);
    expect(isStateDetectionEnabled({ ALERTS_STATE_DETECTION: '1' })).toBe(true);
    expect(isStateDetectionEnabled({ ALERTS_STATE_DETECTION: ' TRUE ' })).toBe(true);
  });
});

describe('localizeContact', () => {
  test('all known states agree and cover at least half the reports', () => {
    expect(localizeContact(2, ['TX', 'TX'])).toBe('TX');
    expect(localizeContact(4, ['TX', 'TX'])).toBe('TX');
  });

  test('stays nationwide on weak or mixed evidence', () => {
    expect(localizeContact(2, ['TX'])).toBeNull(); // only one report names a state
    expect(localizeContact(5, ['TX', 'TX'])).toBeNull(); // most reports have no state
    expect(localizeContact(3, ['TX', 'TX', 'OK'])).toBeNull(); // seen in two states
    expect(localizeContact(2, [])).toBeNull();
  });
});

describe('planAlerts', () => {
  test('localizes a single-state contact under a state-specific tag', () => {
    const [plan] = planAlerts([contact('555-0100', ['FL', 'FL', 'FL'])], [], new Set());
    expect(plan.state).toBe('FL');
    expect(plan.dedupeTag).toBe('pattern:contact:FL:555-0100');
  });

  test('uses the true report count, not the capped description list', () => {
    // 20 reports, only 2 name a state: not enough to localize.
    const [plan] = planAlerts([contact('555-0101', ['FL', 'FL'], 20)], [], new Set());
    expect(plan.state).toBeNull();
  });

  test('a contact already queued nationwide is not re-alerted for a state', () => {
    const c = contact('555-0102', ['FL', 'FL']);
    const [plan] = planAlerts([c], [], new Set([c.dedupeTag]));
    expect(plan).toEqual({ pattern: c, state: null, dedupeTag: 'pattern:contact:555-0102' });
  });

  test('state spike is dropped when the same category spikes nationally', () => {
    const plans = planAlerts([spike('Romance Scams')], [spike('Romance Scams', 'TX'), spike('Tech Support Scams', 'TX')], new Set());
    expect(plans.map((p) => [p.pattern.input.categoryName, p.state])).toEqual([
      ['Romance Scams', null],
      ['Tech Support Scams', 'TX'],
    ]);
  });

  test('ignores state patterns without a valid state', () => {
    expect(planAlerts([], [spike('Romance Scams', 'PR'), spike('Romance Scams')], new Set())).toEqual([]);
  });
});

describe('buildCandidate', () => {
  test('nationwide candidates keep their original wording', () => {
    const c = contact('555-0103', ['TX', 'OK']);
    const candidate = buildCandidate({ pattern: c, state: null, dedupeTag: c.dedupeTag })!;
    expect(candidate.title).toBe('Recurring scam contact reported: 555-0103');
    expect(candidate.is_nationwide).toBe(true);
    expect(candidate.state).toBeNull();
  });

  test('state-targeted candidates name the state and are not nationwide', () => {
    const s = spike('Romance Scams', 'TX');
    const candidate = buildCandidate({ pattern: s, state: 'TX', dedupeTag: s.dedupeTag })!;
    expect(candidate.title).toBe('Reports rising in Texas: Romance Scams');
    expect(candidate.body).toContain('Romance Scams in Texas');
    expect(candidate.is_nationwide).toBe(false);
    expect(candidate.state).toBe('TX');
    expect(candidate.dedupe_tag).toBe('pattern:category:Romance Scams:TX:2026-10');

    const c = contact('bad@example.com', ['FL', 'FL', 'FL']);
    const localized = buildCandidate({ pattern: c, state: 'FL', dedupeTag: 'pattern:contact:FL:bad@example.com' })!;
    expect(localized.title).toBe('Recurring scam contact reported in Florida: bad@example.com');
    expect(localized.body).toContain('concentrated in Florida');
    expect(localized.body).toContain('email address');
  });
});
