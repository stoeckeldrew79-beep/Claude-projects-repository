// US phone numbers to the E.164 form Twilio sends to (+1XXXXXXXXXX).
// Accepts the ways people actually type them: "(305) 555-0142",
// "305.555.0142", "1-305-555-0142", "+1 305 555 0142". Anything else —
// too short, too long, or a non-US country code — is null, so a number
// that could never receive a text is rejected when it's saved rather than
// failing silently when an alert goes out.
export function normalizeUsPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  const national = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (national.length !== 10) return null;
  // NANP: area code and exchange can't start with 0 or 1.
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(national)) return null;
  return `+1${national}`;
}
