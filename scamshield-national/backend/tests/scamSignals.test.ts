import { analyzeMessage, checkLink, extractContacts } from '../src/utils/scamSignals';

const ids = (text: string) => analyzeMessage(text).signals.map((s) => s.id);

describe('analyzeMessage', () => {
  it('flags a fake toll text as high risk', () => {
    const r = analyzeMessage(
      'E-ZPass: You have an unpaid toll balance of $4.15. Pay within 24 hours to avoid a late fee: https://ezpass-tollpay.top/pay'
    );
    expect(r.verdict).toBe('high_risk');
    expect(r.signals.map((s) => s.id)).toEqual(expect.arrayContaining(['package_toll', 'urgency', 'risky_link', 'link_with_pressure']));
    expect(r.links[0].issues.join(' ')).toMatch(/EZPASS/);
  });

  it('flags gift-card and secrecy demands as high risk', () => {
    expect(analyzeMessage('This is the IRS. Buy Google Play cards and do not tell the bank.').verdict).toBe('high_risk');
    expect(ids('Read me the 6-digit code we just sent you')).toContain('verification_code');
    expect(ids('Grandma it\'s me, I\'m in jail and need bail money')).toContain('family_emergency');
    expect(ids('Please install AnyDesk so I can fix the virus')).toContain('remote_access');
  });

  it('finds no signs in an ordinary message', () => {
    const r = analyzeMessage('Hi, are we still on for dinner on Friday at 7? I can pick up the dessert.');
    expect(r.verdict).toBe('no_signs');
    expect(r.signals).toHaveLength(0);
  });

  it('rates a mild single sign as suspicious, not high risk', () => {
    expect(analyzeMessage('We noticed unusual activity on your account.').verdict).toBe('suspicious');
  });
});

describe('checkLink', () => {
  it('passes official brand domains', () => {
    expect(checkLink('https://www.usps.com/track')?.issues).toEqual([]);
    expect(checkLink('tools.usps.com')?.issues).toEqual([]);
  });

  it('catches lookalikes, shorteners and risky endings', () => {
    expect(checkLink('paypa1-secure-login.com')?.issues.join(' ')).toMatch(/PAYPAL/);
    expect(checkLink('https://bit.ly/3xYz')?.issues.join(' ')).toMatch(/shortener/);
    expect(checkLink('usps-redelivery.xyz')?.issues.length).toBeGreaterThanOrEqual(2);
    expect(checkLink('http://192.168.4.20/login')?.issues.join(' ')).toMatch(/number address/);
  });
});

describe('extractContacts', () => {
  it('pulls links, emails and phone numbers out of a message', () => {
    const c = extractContacts('Call (877) 555-0199 or email help@secure-refunds.net, or visit refunds-irs.gov-claim.co/now.');
    expect(c.phones).toEqual(['(877) 555-0199']);
    expect(c.emails).toEqual(['help@secure-refunds.net']);
    expect(c.urls).toEqual(['refunds-irs.gov-claim.co/now']);
  });

  it('does not mistake prices or file names for contacts', () => {
    const c = extractContacts('It costs $4.15 and the file is photo.jpg, e.g. tomorrow.');
    expect(c.urls).toEqual([]);
    expect(c.phones).toEqual([]);
  });
});
