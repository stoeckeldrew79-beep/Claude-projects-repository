// Deliberately abstract/iconographic cover art, not photos or likenesses
// of real people — appropriate for factual coverage of real individuals
// with criminal convictions. Keyed by article slug; falls back to a
// neutral pattern for anything not in the map.

function PonziArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#2b1d0e" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x2 = 200 + Math.cos(angle) * 260;
        const y2 = 60 + Math.sin(angle) * 260;
        return <line key={i} x1="200" y1="60" x2={x2} y2={y2} stroke="#caa25c" strokeWidth="2" opacity="0.35" />;
      })}
      <circle cx="200" cy="60" r="34" fill="none" stroke="#e9c77b" strokeWidth="3" />
      <circle cx="200" cy="60" r="18" fill="#e9c77b" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={150 + i * 40} y={175 - i * 6} width="30" height="10" fill="#caa25c" opacity={0.9 - i * 0.15} />
      ))}
    </svg>
  );
}

function MadoffArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0f1a2b" />
      {[30, 70, 110, 150, 190, 230, 270, 310, 350].map((x, i) => (
        <rect key={x} x={x} y={240 - (60 + (i % 4) * 30)} width="20" height={60 + (i % 4) * 30} fill="#1c3358" />
      ))}
      <polyline
        points="20,80 90,95 160,70 230,110 300,90 380,190"
        fill="none"
        stroke="#e34948"
        strokeWidth="3"
      />
      <circle cx="380" cy="190" r="5" fill="#e34948" />
    </svg>
  );
}

function SpanishPrisonerArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#3a2f22" />
      <rect x="90" y="60" width="220" height="140" fill="#e8dcc0" transform="rotate(-3 200 130)" />
      <rect x="90" y="60" width="220" height="140" fill="none" stroke="#b7a878" strokeWidth="2" transform="rotate(-3 200 130)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="120" y1={90 + i * 18} x2="280" y2={88 + i * 18} stroke="#b7a878" strokeWidth="1.5" transform="rotate(-3 200 130)" />
      ))}
      <circle cx="255" cy="175" r="20" fill="#8a2e2e" transform="rotate(-3 200 130)" />
      <circle cx="255" cy="175" r="20" fill="none" stroke="#5c1c1c" strokeWidth="1" transform="rotate(-3 200 130)" />
    </svg>
  );
}

function AbagnaleArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#173a3a" />
      <path d="M40 190 L200 90 L360 190 Z" fill="none" stroke="#7fd6c7" strokeWidth="2" opacity="0.5" />
      <rect x="130" y="70" width="140" height="90" fill="#e8f4f1" transform="rotate(4 200 115)" />
      <rect x="130" y="70" width="140" height="90" fill="none" stroke="#173a3a" strokeWidth="2" transform="rotate(4 200 115)" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1="145" y1={95 + i * 16} x2="255" y2={93 + i * 16} stroke="#173a3a" strokeWidth="1.5" transform="rotate(4 200 115)" />
      ))}
      <path d="M300 60 L340 50 L330 90 Z" fill="#7fd6c7" />
    </svg>
  );
}

function DelveyArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#191919" />
      {[60, 130, 200, 270, 340].map((x, i) => (
        <rect key={x} x={x} y={240 - (50 + (i % 3) * 40)} width="26" height={50 + (i % 3) * 40} fill="#2a2a2a" />
      ))}
      <polygon points="200,60 225,100 200,140 175,100" fill="none" stroke="#e9c77b" strokeWidth="2.5" />
      <polygon points="200,75 213,100 200,125 187,100" fill="#e9c77b" opacity="0.85" />
    </svg>
  );
}

const ART: Record<string, () => JSX.Element> = {
  'charles-ponzi-the-original-scheme': PonziArt,
  'bernie-madoff-largest-ponzi-scheme': MadoffArt,
  'the-spanish-prisoner-advance-fee-fraud-origins': SpanishPrisonerArt,
  'frank-abagnale-catch-me-if-you-can-fact-check': AbagnaleArt,
  'anna-sorokin-anna-delvey-fake-heiress': DelveyArt,
};

function FallbackArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#1a1a19" />
      <circle cx="200" cy="120" r="50" fill="none" stroke="#898781" strokeWidth="2" />
    </svg>
  );
}

export function NotoriousCoverArt({ slug, className = '' }: { slug: string; className?: string }) {
  const Art = ART[slug] ?? FallbackArt;
  return (
    <div className={`overflow-hidden ${className}`}>
      <Art />
    </div>
  );
}
