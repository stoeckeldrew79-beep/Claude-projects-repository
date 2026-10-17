import { resolveHomeArea } from '../src/utils/homeArea';

describe('resolveHomeArea', () => {
  test('nothing sent leaves the home area alone', () => {
    expect(resolveHomeArea({})).toBeUndefined();
  });

  test('ZIP derives the state; ZIP+4 is stored as 5 digits', () => {
    expect(resolveHomeArea({ zip_code: '33101' })).toEqual({ zip_code: '33101', state: 'FL' });
    expect(resolveHomeArea({ zip_code: ' 10001-1234 ' })).toEqual({ zip_code: '10001', state: 'NY' });
  });

  test('state alone is normalized and kept, ZIP cleared', () => {
    expect(resolveHomeArea({ state: 'tx' })).toEqual({ zip_code: null, state: 'TX' });
  });

  test('matching ZIP and state are accepted', () => {
    expect(resolveHomeArea({ zip_code: '90210', state: 'CA' })).toEqual({ zip_code: '90210', state: 'CA' });
  });

  test('empty values clear the home area', () => {
    expect(resolveHomeArea({ zip_code: '', state: '' })).toEqual({ zip_code: null, state: null });
    expect(resolveHomeArea({ zip_code: null, state: null })).toEqual({ zip_code: null, state: null });
  });

  test('rejects a ZIP in a different state, bad ZIPs and bad states', () => {
    expect(() => resolveHomeArea({ zip_code: '33101', state: 'NY' })).toThrow('is in FL, not NY');
    expect(() => resolveHomeArea({ zip_code: '1234' })).toThrow('ZIP');
    expect(() => resolveHomeArea({ zip_code: 'abcde' })).toThrow('ZIP');
    expect(() => resolveHomeArea({ state: 'ZZ' })).toThrow('state');
    expect(() => resolveHomeArea({ state: 42 })).toThrow('state');
    expect(() => resolveHomeArea({ zip_code: 33101 })).toThrow('ZIP');
  });
});
