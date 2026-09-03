// Matches Magic UI's dot-pattern component: a tiled SVG grid of dots
// used as a subtle background texture. Deliberately low-contrast — this
// is a scam-protection product, the background should read as clean
// and trustworthy, not decorative.
export function DotPattern({
  className = '',
  fillClassName = 'fill-slate-300/40',
}: {
  className?: string;
  fillClassName?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${fillClassName} ${className}`}
    >
      <defs>
        <pattern id="dot-pattern" width={20} height={20} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
          <circle cx={2} cy={2} r={1} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#dot-pattern)" />
    </svg>
  );
}
