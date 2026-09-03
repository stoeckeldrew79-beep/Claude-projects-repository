import { ReactNode } from 'react';

// Deliberately abstract/iconographic cover art, not photos or likenesses
// of real people — appropriate for factual coverage of real individuals
// with criminal convictions (or, for ongoing/unresolved cases, disputed
// allegations). Keyed by article slug; falls back to a neutral pattern
// for anything not in the map.
//
// Every illustration shares a common frame: a two-stop gradient
// background plus a soft radial vignette, so the whole collection reads
// as one consistent, higher-depth visual system instead of flat single
// colors. Gradient/vignette ids are namespaced per frame `id` prop since
// multiple <svg> elements share one DOM when the grid renders.
function CoverFrame({ id, colors, children }: { id: string; colors: [string, string]; children: ReactNode }) {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
        <radialGradient id={`${id}-vignette`} cx="50%" cy="38%" r="75%">
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${id}-bg)`} />
      {children}
      <rect width="400" height="240" fill={`url(#${id}-vignette)`} />
    </svg>
  );
}

function PonziArt() {
  return (
    <CoverFrame id="ponzi" colors={['#3a2712', '#1c1206']}>
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
    </CoverFrame>
  );
}

function MadoffArt() {
  return (
    <CoverFrame id="madoff" colors={['#152848', '#0a121f']}>
      {[30, 70, 110, 150, 190, 230, 270, 310, 350].map((x, i) => (
        <rect key={x} x={x} y={240 - (60 + (i % 4) * 30)} width="20" height={60 + (i % 4) * 30} fill="#1c3358" />
      ))}
      <polyline points="20,80 90,95 160,70 230,110 300,90 380,190" fill="none" stroke="#e34948" strokeWidth="3" />
      <circle cx="380" cy="190" r="5" fill="#e34948" />
    </CoverFrame>
  );
}

function SpanishPrisonerArt() {
  return (
    <CoverFrame id="prisoner" colors={['#4a3a26', '#241c12']}>
      <rect x="90" y="60" width="220" height="140" fill="#e8dcc0" transform="rotate(-3 200 130)" />
      <rect x="90" y="60" width="220" height="140" fill="none" stroke="#b7a878" strokeWidth="2" transform="rotate(-3 200 130)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="120" y1={90 + i * 18} x2="280" y2={88 + i * 18} stroke="#b7a878" strokeWidth="1.5" transform="rotate(-3 200 130)" />
      ))}
      <circle cx="255" cy="175" r="20" fill="#8a2e2e" transform="rotate(-3 200 130)" />
      <circle cx="255" cy="175" r="20" fill="none" stroke="#5c1c1c" strokeWidth="1" transform="rotate(-3 200 130)" />
    </CoverFrame>
  );
}

function AbagnaleArt() {
  return (
    <CoverFrame id="abagnale" colors={['#1e4a4a', '#0d2323']}>
      <path d="M40 190 L200 90 L360 190 Z" fill="none" stroke="#7fd6c7" strokeWidth="2" opacity="0.5" />
      <rect x="130" y="70" width="140" height="90" fill="#e8f4f1" transform="rotate(4 200 115)" />
      <rect x="130" y="70" width="140" height="90" fill="none" stroke="#173a3a" strokeWidth="2" transform="rotate(4 200 115)" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1="145" y1={95 + i * 16} x2="255" y2={93 + i * 16} stroke="#173a3a" strokeWidth="1.5" transform="rotate(4 200 115)" />
      ))}
      <path d="M300 60 L340 50 L330 90 Z" fill="#7fd6c7" />
    </CoverFrame>
  );
}

function DelveyArt() {
  return (
    <CoverFrame id="delvey" colors={['#242424', '#0f0f0f']}>
      {[60, 130, 200, 270, 340].map((x, i) => (
        <rect key={x} x={x} y={240 - (50 + (i % 3) * 40)} width="26" height={50 + (i % 3) * 40} fill="#2a2a2a" />
      ))}
      <polygon points="200,60 225,100 200,140 175,100" fill="none" stroke="#e9c77b" strokeWidth="2.5" />
      <polygon points="200,75 213,100 200,125 187,100" fill="#e9c77b" opacity="0.85" />
    </CoverFrame>
  );
}

function TheranosArt() {
  return (
    <CoverFrame id="theranos" colors={['#123a3e', '#061a1c']}>
      <path d="M200 50 C240 110 260 145 260 170 A60 60 0 1 1 140 170 C140 145 160 110 200 50 Z" fill="#8fd6c4" opacity="0.9" />
      <rect x="150" y="185" width="100" height="14" fill="#173a3a" />
      <line x1="130" y1="205" x2="270" y2="205" stroke="#8fd6c4" strokeWidth="2" opacity="0.4" />
    </CoverFrame>
  );
}

function FTXArt() {
  return (
    <CoverFrame id="ftx" colors={['#161f3a', '#080b16']}>
      <circle cx="200" cy="110" r="55" fill="none" stroke="#7c8cff" strokeWidth="3" />
      <line x1="165" y1="80" x2="235" y2="150" stroke="#e34948" strokeWidth="4" />
      <line x1="235" y1="80" x2="165" y2="150" stroke="#e34948" strokeWidth="4" />
      <polyline points="30,210 90,190 150,205 210,175 270,195 380,120" fill="none" stroke="#7c8cff" strokeWidth="2" opacity="0.6" />
    </CoverFrame>
  );
}

function BelfortArt() {
  return (
    <CoverFrame id="belfort" colors={['#1c3527', '#0a150e']}>
      <polyline points="20,190 100,140 160,155 220,70 300,95 380,200" fill="none" stroke="#e9c77b" strokeWidth="3" />
      <circle cx="220" cy="70" r="6" fill="#e9c77b" />
      <rect x="40" y="40" width="26" height="42" rx="4" fill="#caa25c" opacity="0.85" />
    </CoverFrame>
  );
}

function StanfordArt() {
  return (
    <CoverFrame id="stanford" colors={['#0f3350', '#061826']}>
      <rect x="110" y="110" width="180" height="90" fill="#1c435e" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={125 + i * 33} y="120" width="14" height="70" fill="#0b2436" />
      ))}
      <polygon points="100,110 300,110 200,70" fill="#1c435e" />
      <path d="M320 200 C330 160 350 150 350 120 C350 150 370 160 380 200 Z" fill="#4f8f6b" opacity="0.8" />
    </CoverFrame>
  );
}

function FyreArt() {
  return (
    <CoverFrame id="fyre" colors={['#2b1808', '#140a02']}>
      <rect x="130" y="50" width="140" height="140" fill="#ff8c1a" />
      <polygon points="60,205 110,150 160,205" fill="none" stroke="#ff8c1a" strokeWidth="2" opacity="0.5" />
      <polygon points="240,205 290,150 340,205" fill="none" stroke="#ff8c1a" strokeWidth="2" opacity="0.5" />
    </CoverFrame>
  );
}

function CrundwellArt() {
  return (
    <CoverFrame id="crundwell" colors={['#3a2a1a', '#1c130c']}>
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
    </CoverFrame>
  );
}

function EnronArt() {
  return (
    <CoverFrame id="enron" colors={['#1a3327', '#0a1712']}>
      <rect x="150" y="40" width="100" height="160" fill="#255c45" />
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect key={`${row}-${col}`} x={165 + col * 25} y={55 + row * 22} width="14" height="12" fill="#0a1712" opacity="0.6" />
        ))
      )}
      <path d="M150 40 L200 15 L250 40 Z" fill="#255c45" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={40 + i * 10} y={185 + i * 3} width="26" height="6" fill="#e8dcc0" opacity={0.8 - i * 0.15} transform={`rotate(${-8 + i * 6} 60 190)`} />
      ))}
      <polyline points="290,190 320,150 300,120 340,60" fill="none" stroke="#e34948" strokeWidth="3" />
    </CoverFrame>
  );
}

function WirecardArt() {
  return (
    <CoverFrame id="wirecard" colors={['#3a1414', '#180707']}>
      <rect x="120" y="90" width="160" height="100" rx="10" fill="#e8dcc0" />
      <rect x="120" y="110" width="160" height="24" fill="#8a2e2e" />
      <line x1="140" y1="160" x2="200" y2="160" stroke="#8a2e2e" strokeWidth="4" />
      <line x1="130" y1="90" x2="170" y2="50" stroke="#8a2e2e" strokeWidth="3" opacity="0.7" />
      <line x1="170" y1="90" x2="220" y2="40" stroke="#8a2e2e" strokeWidth="3" opacity="0.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={250 + i * 22} cy={210 - i * 8} r="3" fill="#e8dcc0" opacity={0.7 - i * 0.12} />
      ))}
    </CoverFrame>
  );
}

function BreXArt() {
  return (
    <CoverFrame id="brex" colors={['#1c2e18', '#0a130a']}>
      <polygon points="60,200 140,80 220,200" fill="#2f4a28" />
      <polygon points="180,200 260,110 340,200" fill="#26401f" />
      <rect x="125" y="150" width="30" height="50" fill="#0a130a" />
      {[
        [135, 165],
        [142, 172],
        [130, 178],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#e9c77b" />
      ))}
      <polyline points="30,60 90,50 150,70 210,40 270,75 380,180" fill="none" stroke="#e34948" strokeWidth="2.5" opacity="0.8" />
    </CoverFrame>
  );
}

function NiravModiArt() {
  return (
    <CoverFrame id="niravmodi" colors={['#122b4a', '#060f1e']}>
      <polygon points="200,55 235,95 200,185 165,95" fill="none" stroke="#8fd0e8" strokeWidth="2.5" />
      <polygon points="200,55 235,95 165,95" fill="#8fd0e8" opacity="0.55" />
      <line x1="182" y1="95" x2="200" y2="185" stroke="#8fd0e8" strokeWidth="1.5" opacity="0.6" />
      <line x1="218" y1="95" x2="200" y2="185" stroke="#8fd0e8" strokeWidth="1.5" opacity="0.6" />
      <rect x="270" y="140" width="70" height="55" fill="#1c435e" />
      <circle cx="305" cy="167" r="12" fill="none" stroke="#0b2436" strokeWidth="3" />
    </CoverFrame>
  );
}

function PearlmanArt() {
  return (
    <CoverFrame id="pearlman" colors={['#3a1f3a', '#180b18']}>
      <polygon points="200,50 214,88 255,88 222,112 234,150 200,127 166,150 178,112 145,88 186,88" fill="#e9c77b" opacity="0.9" />
      <path d="M180 175 C180 160 220 160 220 175 L220 210 L180 210 Z" fill="#caa25c" />
      <rect x="195" y="150" width="10" height="30" fill="#caa25c" />
      <ellipse cx="200" cy="150" rx="14" ry="8" fill="#e8dcc0" />
    </CoverFrame>
  );
}

function SchrenkerArt() {
  return (
    <CoverFrame id="schrenker" colors={['#2a4a6e', '#e08a3c']}>
      <polygon points="100,150 260,120 300,130 260,135 110,158" fill="#e8dcc0" />
      <polygon points="180,120 195,90 205,120" fill="#e8dcc0" />
      <circle cx="300" cy="60" r="14" fill="none" stroke="#e8dcc0" strokeWidth="2.5" />
      <path d="M300 74 L300 100 M300 100 L285 90 M300 100 L315 90" stroke="#e8dcc0" strokeWidth="2" />
      <path d="M286 56 A14 20 0 0 1 314 56" fill="none" stroke="#e8dcc0" strokeWidth="2" />
    </CoverFrame>
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
  'enron-accounting-fraud-collapse': EnronArt,
  'wirecard-jan-marsalek-fraud': WirecardArt,
  'bre-x-gold-mine-fraud': BreXArt,
  'nirav-modi-punjab-national-bank-fraud': NiravModiArt,
  'lou-pearlman-boy-band-ponzi-scheme': PearlmanArt,
  'marcus-schrenker-faked-plane-crash-fraud': SchrenkerArt,
};

function FallbackArt() {
  return (
    <CoverFrame id="fallback" colors={['#242422', '#121211']}>
      <circle cx="200" cy="120" r="50" fill="none" stroke="#898781" strokeWidth="2" />
    </CoverFrame>
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
