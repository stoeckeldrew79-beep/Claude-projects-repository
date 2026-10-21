import { useId } from 'react';

// The brand mark, "Sentinel Prime" (chosen 2026-10-18, Drew): a navy shield
// holding a precision target. Precision tick marks (an instrument), a
// segmented outer ring, globe lines inside the target (international), a red
// radar sweep (always scanning) and a red core (the scam, locked on).
// Deliberately not a government seal: no eagle, no stars, no ring of text.
// The mark carries no name, so it survives the coming rename unchanged.
//
// `animated` brings it to life (header and launch page only): the radar
// sweep turns continuously with a bright leading edge, and the red core
// pulses out a ping — the site visibly scanning. All of it stays still for
// anyone who prefers reduced motion.
const SHIELD = 'M32 3.5 L55.5 10.5 C56.5 24 55.5 36 51 44.5 C46.5 52.5 40 57.5 32 61 C24 57.5 17.5 52.5 13 44.5 C8.5 36 7.5 24 8.5 10.5 Z';
const INNER = 'M32 8.2 L51.2 13.9 C52 25.2 51.2 35 47.4 42.2 C43.7 49 38.4 53.3 32 56.3 C25.6 53.3 20.3 49 16.6 42.2 C12.8 35 12 25.2 12.8 13.9 Z';
const SWEEP = 'M32 30 L32.98 18.84 A11.2 11.2 0 0 1 41.70 24.40 Z';
const TICKS: [number, number, number, number][] = [
  [32.0, 11.4, 32.0, 9.4],
  [41.65, 13.29, 42.3, 12.16],
  [48.71, 20.35, 49.84, 19.7],
  [50.6, 30.0, 52.6, 30.0],
  [48.71, 39.65, 49.84, 40.3],
  [41.65, 46.71, 42.3, 47.84],
  [32.0, 48.6, 32.0, 50.6],
  [22.35, 46.71, 21.7, 47.84],
  [15.29, 39.65, 14.16, 40.3],
  [13.4, 30.0, 11.4, 30.0],
  [15.29, 20.35, 14.16, 19.7],
  [22.35, 13.29, 21.7, 12.16],
];

export function ShieldLogo({ className = 'h-8 w-8', animated = false }: { className?: string; animated?: boolean }) {
  // Several logos render on one page (header, footer, menu), so gradient and
  // clip ids must be unique per instance.
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`sweep-${id}`} x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(-58 .5 .5)">
          <stop offset="0" stopColor="#ff3b36" stopOpacity="0" />
          <stop offset="1" stopColor="#ff3b36" stopOpacity=".75" />
        </linearGradient>
        <clipPath id={`globe-${id}`}>
          <circle cx="32" cy="30" r="11.2" />
        </clipPath>
      </defs>
      <path d={SHIELD} fill="#0b1424" stroke="#4a5f86" strokeWidth="1.4" />
      <path d={INNER} fill="none" stroke="#ffffff" strokeOpacity=".22" strokeWidth=".9" />
      <g stroke="#ffffff" strokeOpacity=".55" strokeWidth=".9" strokeLinecap="round">
        {TICKS.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g transform="rotate(45 32 30)">
        <circle cx="32" cy="30" r="15.6" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeDasharray="20.4 4.1" />
      </g>
      <g clipPath={`url(#globe-${id})`} fill="none" stroke="#9fb3d6" strokeOpacity=".38" strokeWidth=".7">
        <ellipse cx="32" cy="30" rx="4.6" ry="11.2" />
        <ellipse cx="32" cy="30" rx="8.6" ry="11.2" />
        <line x1="32" y1="18.8" x2="32" y2="41.2" />
        <line x1="20.8" y1="30" x2="43.2" y2="30" />
        <path d="M21.6 25.4 Q32 23.8 42.4 25.4" />
        <path d="M21.6 34.6 Q32 36.2 42.4 34.6" />
      </g>
      <g className={animated ? 'logo-sweep' : undefined}>
        <path d={SWEEP} fill={`url(#sweep-${id})`} />
        {animated && <line x1="32" y1="30" x2="41.70" y2="24.40" stroke="#ff5a55" strokeWidth=".9" strokeLinecap="round" />}
      </g>
      {animated && (
        <circle className="logo-ping" cx="32" cy="30" r="3.4" fill="none" stroke="#ff3b36" strokeWidth=".8" />
      )}
      <circle cx="32" cy="30" r="11.2" fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <circle className={animated ? 'logo-core' : undefined} cx="32" cy="30" r="5.6" fill="#e0312f" fillOpacity=".22" />
      <circle cx="32" cy="30" r="3.4" fill="#ff3b36" />
      <circle cx="31" cy="28.9" r=".9" fill="#ffffff" fillOpacity=".7" />
    </svg>
  );
}
