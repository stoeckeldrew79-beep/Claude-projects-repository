import { normalizeUsPhone } from '../src/utils/phone';

describe('normalizeUsPhone', () => {
  it('normalizes common US formats to E.164', () => {
    expect(normalizeUsPhone('(305) 555-0142')).toBe('+13055550142');
    expect(normalizeUsPhone('305.555.0142')).toBe('+13055550142');
    expect(normalizeUsPhone('1-305-555-0142')).toBe('+13055550142');
    expect(normalizeUsPhone('+1 305 555 0142')).toBe('+13055550142');
  });

  it('rejects numbers that cannot receive a US text', () => {
    expect(normalizeUsPhone('555-0142')).toBeNull();
    expect(normalizeUsPhone('+44 20 7946 0958')).toBeNull();
    expect(normalizeUsPhone('(105) 555-0142')).toBeNull();
    expect(normalizeUsPhone('')).toBeNull();
  });
});
