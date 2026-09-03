// ScamShield National's own brand mark — a shield motif conveying
// protection, deliberately NOT styled as a government/federal seal
// (no eagle, no stars-and-stripes ring, no ".gov" trade dress). Plain
// geometric shield + checkmark, the same visual family as any private
// security/insurance/consumer-protection brand.
export function ShieldLogo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 4L8 10V22C8 32.5 14.6 40.8 24 44C33.4 40.8 40 32.5 40 22V10L24 4Z"
        fill="#0f1a2b"
        stroke="#0f1a2b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 8L12 12.6V22C12 30.4 17.3 36.9 24 39.6C30.7 36.9 36 30.4 36 22V12.6L24 8Z"
        fill="#e34948"
      />
      <path
        d="M17 23.5L21.5 28L31 17.5"
        stroke="#fcfcfb"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
