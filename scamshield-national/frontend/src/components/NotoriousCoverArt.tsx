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

function TheranosArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0e2b2e" />
      <path d="M200 50 C240 110 260 145 260 170 A60 60 0 1 1 140 170 C140 145 160 110 200 50 Z" fill="#8fd6c4" opacity="0.9" />
      <rect x="150" y="185" width="100" height="14" fill="#173a3a" />
      <line x1="130" y1="205" x2="270" y2="205" stroke="#8fd6c4" strokeWidth="2" opacity="0.4" />
    </svg>
  );
}

function FTXArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0d1321" />
      <circle cx="200" cy="110" r="55" fill="none" stroke="#7c8cff" strokeWidth="3" />
      <line x1="165" y1="80" x2="235" y2="150" stroke="#e34948" strokeWidth="4" />
      <line x1="235" y1="80" x2="165" y2="150" stroke="#e34948" strokeWidth="4" />
      <polyline points="30,210 90,190 150,205 210,175 270,195 380,120" fill="none" stroke="#7c8cff" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

function BelfortArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#14251c" />
      <polyline points="20,190 100,140 160,155 220,70 300,95 380,200" fill="none" stroke="#e9c77b" strokeWidth="3" />
      <circle cx="220" cy="70" r="6" fill="#e9c77b" />
      <rect x="40" y="40" width="26" height="42" rx="4" fill="#caa25c" opacity="0.85" />
    </svg>
  );
}

function StanfordArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#0b2436" />
      <rect x="110" y="110" width="180" height="90" fill="#1c435e" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={125 + i * 33} y="120" width="14" height="70" fill="#0b2436" />
      ))}
      <polygon points="100,110 300,110 200,70" fill="#1c435e" />
      <path d="M320 200 C330 160 350 150 350 120 C350 150 370 160 380 200 Z" fill="#4f8f6b" opacity="0.8" />
    </svg>
  );
}

function FyreArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#1c1006" />
      <rect x="130" y="50" width="140" height="140" fill="#ff8c1a" />
      <polygon points="60,205 110,150 160,205" fill="none" stroke="#ff8c1a" strokeWidth="2" opacity="0.5" />
      <polygon points="240,205 290,150 340,205" fill="none" stroke="#ff8c1a" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

function CrundwellArt() {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#2b1f14" />
      <path
        d="M80 190 C90 150 110 130 95 100 C120 105 135 90 150 95 C170 80 200 85 210 105 C225 100 240 115 235 135 L245 190 L215 190 L210 160 L120 160 L110 190 Z"
        fill="#caa25c"
        opacity="0.9"
      />
      <rect x="280" y="90" width="70" height="50" fill="#e8dcc0" />
      <line x1="290" y1="105" x2="340" y2="105" stroke="#2b1f14" strokeWidth="2" />
      <line x1="290" y1="118" x2="340" y2="118" stroke="#2b1f14" strokeWidth="2" />
      <circle cx="315" cy="115" r="26" fill="none" stroke="#8a2e2e" strokeWidth="3" />
      <line x1="298" y1="98" x2="332" y2="132" stroke="#8a2e2e" strokeWidth="3" />
    </svg>
  );
}

const ART: Record<string, () => JSX.Element> = {
  'charles-ponzi-the-original-scheme': PonziArt,
  'bernie-madoff-largest-ponzi-scheme': MadoffArt,
  'the-spanish-prisoner-advance-fee-fraud-origins': SpanishPrisonerArt,
  'frank-abagnale-catch-me-if-you-can-fact-check': AbagnaleArt,
  'anna-sorokin-anna-delvey-fake-heiress': DelveyArt,
  'elizabeth-holmes-theranos-fraud': TheranosArt,
  'sam-bankman-fried-ftx-collapse': FTXArt,
  'jordan-belfort-stratton-oakmont-wolf-of-wall-street': BelfortArt,
  'allen-stanford-stanford-financial-ponzi-scheme': StanfordArt,
  'billy-mcfarland-fyre-festival': FyreArt,
  'rita-crundwell-dixon-illinois-embezzlement': CrundwellArt,
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
