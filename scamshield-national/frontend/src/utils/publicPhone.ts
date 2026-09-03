// Optional public contact number — unset until a real number (or a free
// forwarding number, e.g. Google Voice) is configured. Deliberately not
// hardcoded: never show a phone number on this site that isn't real and
// actually answered.
export const PUBLIC_PHONE = (import.meta.env.VITE_PUBLIC_PHONE as string | undefined)?.trim() || undefined;

export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    const d = digits.slice(1);
    return `1-${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

export function telHref(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, '');
  return `tel:${digits.startsWith('+') ? digits : `+1${digits.replace(/\D/g, '')}`}`;
}
