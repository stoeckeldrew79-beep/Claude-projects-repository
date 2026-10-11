// ScamShield National's own brand mark — a monogram seal: deliberately
// NOT styled as a government/federal seal (no eagle, no stars-and-stripes
// ring, no ".gov" trade dress), closer to the badge a bank or insurer uses
// to signal trust. Chosen (2026-10-11, Drew) over three shield-silhouette
// alternatives specifically because it's the one that still reads cleanly
// at favicon/app-icon size, where the rest of the marketing push depends
// on it being instantly recognizable.
export function ShieldLogo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#0f1a2b" />
      <circle cx="50" cy="50" r="42" fill="#e34948" />
      <text
        x="50"
        y="69"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="58"
        fontWeight="700"
        fill="#fcfcfb"
      >
        S
      </text>
    </svg>
  );
}
