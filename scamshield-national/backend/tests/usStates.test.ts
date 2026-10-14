import fs from 'fs';
import path from 'path';
import {
  InvalidStateError,
  isUsStateCode,
  resolveReportState,
  stateForZip,
  US_STATE_CODES,
} from '../src/utils/usStates';

test('US_STATE_CODES is the 50 states plus DC', () => {
  expect(US_STATE_CODES).toHaveLength(51);
  expect(new Set(US_STATE_CODES).size).toBe(51);
  expect(isUsStateCode('DC')).toBe(true);
  expect(isUsStateCode('PR')).toBe(false);
  expect(isUsStateCode('tx')).toBe(false);
});

test('migration 029 CHECK lists exactly the same codes as US_STATE_CODES', () => {
  const sql = fs.readFileSync(
    path.join(__dirname, '../src/db/migrations/029_scam_reports_state.sql'),
    'utf8'
  );
  const check = sql.slice(sql.indexOf('scam_reports_state_valid'));
  const codes = check.slice(0, check.indexOf(');')).match(/'([A-Z]{2})'/g)!.map((c) => c.slice(1, 3));
  expect([...codes].sort()).toEqual([...US_STATE_CODES].sort());
});

test.each([
  ['00501', 'NY'],
  ['02108', 'MA'],
  ['05501', 'MA'],
  ['05401', 'VT'],
  ['10001', 'NY'],
  ['20001', 'DC'],
  ['20166', 'VA'],
  ['33101', 'FL'],
  ['60601', 'IL'],
  ['73301', 'TX'],
  ['73102', 'OK'],
  ['79936', 'TX'],
  ['88510', 'TX'],
  ['90210', 'CA'],
  ['96813', 'HI'],
  ['99501', 'AK'],
  ['98101-1234', 'WA'],
])('stateForZip(%s) = %s', (zip, state) => {
  expect(stateForZip(zip)).toBe(state);
});

test.each(['00901', '09001', '34001', '96201', '96910', '1234', 'ABCDE', '123456', ''])(
  'stateForZip(%p) is null for territories, military and malformed input',
  (zip) => {
    expect(stateForZip(zip)).toBeNull();
  }
);

describe('resolveReportState', () => {
  test('no location at all stays unknown — state is optional', () => {
    expect(resolveReportState({ country: 'US' })).toEqual({ state: null, state_source: null });
    expect(resolveReportState({})).toEqual({ state: null, state_source: null });
  });

  test("reporter's chosen state is normalized and wins over the ZIP", () => {
    expect(resolveReportState({ country: 'US', state: ' tx ', zip_code: '10001' })).toEqual({
      state: 'TX',
      state_source: 'reporter',
    });
  });

  test('empty state falls back to the ZIP', () => {
    expect(resolveReportState({ country: 'US', state: '', zip_code: '10001' })).toEqual({
      state: 'NY',
      state_source: 'zip',
    });
  });

  test('unknown or non-string state is rejected', () => {
    expect(() => resolveReportState({ country: 'US', state: 'ZZ' })).toThrow(InvalidStateError);
    expect(() => resolveReportState({ country: 'US', state: 'PR' })).toThrow(InvalidStateError);
    expect(() => resolveReportState({ country: 'US', state: 42 })).toThrow(InvalidStateError);
  });

  test('non-US reports never carry a state, even if one is sent', () => {
    expect(resolveReportState({ country: 'CA', state: 'TX', zip_code: '10001' })).toEqual({
      state: null,
      state_source: null,
    });
  });

  test('unmappable ZIP leaves state unknown rather than guessing', () => {
    expect(resolveReportState({ country: 'US', zip_code: '00901' })).toEqual({ state: null, state_source: null });
  });
});
