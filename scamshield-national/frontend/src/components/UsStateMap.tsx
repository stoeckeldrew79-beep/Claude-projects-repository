import { useMemo, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import usTopology from 'us-atlas/states-10m.json';
import { US_STATE_NAMES } from '../utils/usStates';
import { DailyNewsStateCount } from '../types';

const WIDTH = 960;
const HEIGHT = 600;

// Sequential ramp, low -> high alert volume. One hue, monotonic lightness,
// anchored for the dark panel this map sits in: the lowest bucket sits
// nearest the surface and the highest is brightest. Validated for lightness
// monotonicity and for staying brighter than the no-data fill, so a state
// with one alert never reads as quieter than a state with none.
const RAMP = ['#7f1d1d', '#a52121', '#c62828', '#e03131', '#f87171'];
const NO_DATA = '#1e293b';
const SURFACE = '#0f1a2b';

// us-atlas identifies states by name; the API speaks USPS codes.
// Territories in us-atlas (Puerto Rico, Guam...) have no entry here, so the
// lookup is genuinely partial.
const CODE_BY_NAME: Record<string, string | undefined> = Object.fromEntries(
  Object.entries(US_STATE_NAMES).map(([code, name]) => [name, code])
);

interface Props {
  counts: DailyNewsStateCount[];
  onStateClick: (code: string) => void;
}

interface Shape {
  name: string;
  code: string | null;
  d: string;
}

interface Hovered {
  code: string;
  name: string;
  total: number;
  agCount: number;
  x: number;
  y: number;
}

// Quantile breaks over the observed values rather than fixed thresholds: alert
// volume is heavily skewed (one state can hold ten times another), and even
// buckets would put almost every state in the lowest one.
function makeScale(values: number[]): (n: number) => string {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 0) return () => NO_DATA;
  const breaks = RAMP.slice(1).map((_, i) => {
    const q = (i + 1) / RAMP.length;
    return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  });
  return (n: number) => {
    let bucket = 0;
    while (bucket < breaks.length && n >= breaks[bucket]) bucket += 1;
    return RAMP[bucket];
  };
}

export function UsStateMap({ counts, onStateClick }: Props) {
  const [hovered, setHovered] = useState<Hovered | null>(null);

  const byCode = useMemo(
    () => Object.fromEntries(counts.map((c) => [c.state, c])),
    [counts]
  );
  const colorFor = useMemo(
    () => makeScale(counts.map((c) => c.total)),
    [counts]
  );

  const shapes = useMemo<Shape[]>(() => {
    const topo = usTopology as unknown as Topology;
    const collection = feature(
      topo,
      topo.objects.states as GeometryCollection
    ) as unknown as GeoJSON.FeatureCollection;
    // fitSize keeps the map filling the viewBox regardless of projection
    // constants, so the SVG scales cleanly at any panel width.
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);
    return collection.features
      .map((f) => {
        const name = String((f.properties as { name?: string })?.name ?? '');
        const d = path(f);
        // AlbersUsa returns null for geometries outside the US layout
        // (territories); those simply do not render.
        return d ? { name, code: CODE_BY_NAME[name] ?? null, d } : null;
      })
      .filter((s): s is Shape => s !== null);
  }, []);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="US map of scam alert counts by state"
      >
        <rect width={WIDTH} height={HEIGHT} fill={SURFACE} />
        {shapes.map((s) => {
          const row = s.code ? byCode[s.code] : undefined;
          const interactive = Boolean(row);
          return (
            <path
              key={s.name}
              d={s.d}
              fill={row ? colorFor(row.total) : NO_DATA}
              // A 2px surface-coloured gap between fills, so neighbouring
              // states stay separable at every step of the ramp.
              stroke={SURFACE}
              strokeWidth={2}
              className={interactive ? 'cursor-pointer outline-none' : ''}
              tabIndex={interactive ? 0 : -1}
              role={interactive ? 'button' : undefined}
              aria-label={
                row
                  ? `${s.name}: ${row.total} alert${row.total === 1 ? '' : 's'}`
                  : undefined
              }
              onMouseMove={(e) => {
                if (!row || !s.code) return;
                const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setHovered({
                  code: s.code,
                  name: s.name,
                  total: row.total,
                  agCount: row.ag_count,
                  x: box ? e.clientX - box.left : 0,
                  y: box ? e.clientY - box.top : 0,
                });
              }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => s.code && row && onStateClick(s.code)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && s.code && row) {
                  e.preventDefault();
                  onStateClick(s.code);
                }
              }}
              style={
                hovered?.code === s.code
                  ? { stroke: '#ffffff', strokeWidth: 2 }
                  : undefined
              }
            />
          );
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded-md bg-slate-900/95 px-3 py-2 text-xs text-white shadow-lg ring-1 ring-white/10"
          style={{ left: hovered.x + 12, top: hovered.y + 12 }}
        >
          <p className="font-semibold">{hovered.name}</p>
          <p className="mt-0.5 text-slate-300">
            {hovered.total} alert{hovered.total === 1 ? '' : 's'}
            {hovered.agCount > 0 && ` · ${hovered.agCount} official AG`}
          </p>
        </div>
      )}

      {/* A sequential scale needs its legend: the ramp encodes magnitude, and
          without it the colours are decoration. */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
        <span>Fewer alerts</span>
        <div className="flex">
          {RAMP.map((c) => (
            <span key={c} className="h-3 w-8" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span>More</span>
        <span className="ml-2 flex items-center gap-1.5">
          <span className="h-3 w-8" style={{ backgroundColor: NO_DATA }} />
          No alerts recorded
        </span>
      </div>
    </div>
  );
}
