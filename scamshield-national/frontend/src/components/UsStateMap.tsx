import { useMemo, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import usTopology from 'us-atlas/states-10m.json';
import { US_STATE_NAMES } from '../utils/usStates';

const WIDTH = 960;
const HEIGHT = 600;

// Sequential ramp, low -> high. On this dark panel "more" has to read as
// brighter and hotter, so the ramp climbs in lightness AND saturation: the
// lowest bucket is a dim, greyed maroon barely lifted off the surface, the
// highest a vivid alarm red. (The old ramp ended in a pale pink, which on
// dark navy looked weaker than the deep reds — the scale read backwards.)
// Validated (dataviz ordinal check vs #0f1a2b): monotone lightness, every
// adjacent step >= 0.06 apart, lowest step >= 2:1 against the surface.
const RAMP = ['#7a3c4a', '#a83a44', '#cc3d36', '#ee5233', '#ff8a62'];
const NO_DATA = '#172235';
const SURFACE = '#0f1a2b';

// Places that have entries but either do not render in the Albers USA
// layout (the five inhabited territories) or are too small to tap (DC).
// Listed beneath the map so they are never silently missing.
export const US_TERRITORY_NAMES: Record<string, string> = {
  DC: 'District of Columbia',
  PR: 'Puerto Rico',
  GU: 'Guam',
  VI: 'U.S. Virgin Islands',
  AS: 'American Samoa',
  MP: 'Northern Mariana Islands',
};

// us-atlas identifies states by name; the API speaks USPS codes.
const CODE_BY_NAME: Record<string, string | undefined> = Object.fromEntries(
  Object.entries(US_STATE_NAMES).map(([code, name]) => [name, code])
);

export function jurisdictionName(code: string): string {
  return US_STATE_NAMES[code] ?? US_TERRITORY_NAMES[code] ?? code;
}

// Serves two views: documented scams and live alerts. ag_count belongs to an
// alert's source and has no meaning for a database entry, so it is optional.
export interface StateCount {
  state: string;
  total: number;
  ag_count?: number;
}

interface Props {
  counts: StateCount[];
  onStateClick: (code: string) => void;
  unit: { singular: string; plural: string };
}

interface Shape {
  name: string;
  code: string | null;
  d: string;
}

interface Focus {
  code: string;
  name: string;
  total: number;
  agCount?: number;
  rank: number;
  // Position within the map wrapper, in CSS px; null for touch (card mode).
  x: number | null;
  y: number | null;
}

interface Bucket {
  color: string;
  min: number;
  max: number;
}

// Quantile buckets over the observed values: counts are heavily skewed (one
// state can hold ten times another), so equal-width buckets would put almost
// every state in the lowest one. Buckets are returned with their real
// min/max so the legend can print actual numbers, and empty buckets
// (duplicate breaks on small datasets) are dropped from the legend.
function makeBuckets(values: number[]): { colorFor: (n: number) => string; buckets: Bucket[] } {
  const sorted = values.filter((v) => v > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return { colorFor: () => NO_DATA, buckets: [] };
  const breaks = RAMP.slice(1).map((_, i) => sorted[Math.min(sorted.length - 1, Math.floor(((i + 1) / RAMP.length) * sorted.length))]);
  const bucketOf = (n: number) => {
    let b = 0;
    while (b < breaks.length && n >= breaks[b]) b += 1;
    return b;
  };
  const ranges = RAMP.map((color) => ({ color, min: Infinity, max: -Infinity }));
  for (const v of sorted) {
    const r = ranges[bucketOf(v)];
    r.min = Math.min(r.min, v);
    r.max = Math.max(r.max, v);
  }
  return {
    colorFor: (n: number) => (n > 0 ? RAMP[bucketOf(n)] : NO_DATA),
    buckets: ranges.filter((r) => r.min !== Infinity),
  };
}

export function UsStateMap({ counts, onStateClick, unit }: Props) {
  const [focus, setFocus] = useState<Focus | null>(null);

  const byCode = useMemo(() => Object.fromEntries(counts.map((c) => [c.state, c])), [counts]);
  const rankOf = useMemo(() => {
    const sorted = [...counts].sort((a, b) => b.total - a.total);
    return Object.fromEntries(sorted.map((c, i) => [c.state, i + 1]));
  }, [counts]);
  const { colorFor, buckets } = useMemo(() => makeBuckets(counts.map((c) => c.total)), [counts]);

  const shapes = useMemo<Shape[]>(() => {
    const topo = usTopology as unknown as Topology;
    const collection = feature(topo, topo.objects.states as GeometryCollection) as unknown as GeoJSON.FeatureCollection;
    const projection = geoAlbersUsa().fitSize([WIDTH, HEIGHT], collection);
    const path = geoPath(projection);
    return collection.features
      .map((f) => {
        const name = String((f.properties as { name?: string })?.name ?? '');
        const d = path(f);
        // AlbersUsa returns null for territories; they are listed below.
        return d ? { name, code: CODE_BY_NAME[name] ?? null, d } : null;
      })
      .filter((s): s is Shape => s !== null);
  }, []);

  const offMap = useMemo(
    () =>
      Object.keys(US_TERRITORY_NAMES)
        .map((code) => byCode[code])
        .filter((r): r is StateCount => Boolean(r)),
    [byCode]
  );

  function focusFor(code: string, x: number | null, y: number | null): Focus | null {
    const row = byCode[code];
    if (!row) return null;
    return { code, name: jurisdictionName(code), total: row.total, agCount: row.ag_count, rank: rankOf[code], x, y };
  }

  const label = (n: number) => `${n.toLocaleString()} ${n === 1 ? unit.singular : unit.plural}`;

  return (
    <div>
      <div className="relative" onMouseLeave={() => setFocus((f) => (f && f.x !== null ? null : f))}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="group" aria-label={`US map of ${unit.plural} by state`}>
          <rect width={WIDTH} height={HEIGHT} fill={SURFACE} />
          {shapes.map((s) => {
            const row = s.code ? byCode[s.code] : undefined;
            const interactive = Boolean(row);
            const isFocus = focus?.code === s.code;
            return (
              <path
                key={s.name}
                d={s.d}
                fill={row ? colorFor(row.total) : NO_DATA}
                stroke={isFocus ? '#ffffff' : SURFACE}
                strokeWidth={isFocus ? 2.5 : 1.5}
                className={interactive ? 'cursor-pointer outline-none transition-[fill] hover:brightness-125' : ''}
                tabIndex={interactive ? 0 : -1}
                role={interactive ? 'button' : undefined}
                aria-label={row ? `${s.name}: ${label(row.total)}. Open ${s.name}.` : undefined}
                onPointerMove={(e) => {
                  if (e.pointerType !== 'mouse' || !s.code || !row) return;
                  const box = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  setFocus(focusFor(s.code, box ? e.clientX - box.left : 0, box ? e.clientY - box.top : 0));
                }}
                onPointerUp={(e) => {
                  if (!s.code || !row) return;
                  if (e.pointerType === 'mouse') {
                    onStateClick(s.code);
                    return;
                  }
                  // Touch: first tap shows the count, a second tap on the same
                  // state (or the card's button) opens it.
                  if (focus?.code === s.code) onStateClick(s.code);
                  else setFocus(focusFor(s.code, null, null));
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && s.code && row) {
                    e.preventDefault();
                    onStateClick(s.code);
                  }
                }}
                // Keyboard focus only: a tap also focuses the path, and treating
                // that as a first tap would make every tap navigate at once.
                onFocus={(e) => {
                  if (s.code && row && e.currentTarget.matches(':focus-visible')) setFocus(focusFor(s.code, null, null));
                }}
              />
            );
          })}
        </svg>

        {focus && focus.x !== null && focus.y !== null && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg bg-slate-950/95 px-3 py-2 text-xs text-white shadow-xl ring-1 ring-white/10"
            style={{ left: focus.x + 14, top: focus.y + 14 }}
          >
            <p className="font-semibold">{focus.name}</p>
            <p className="mt-0.5 text-slate-300">
              <span className="font-semibold text-red-300 tabular-nums">{focus.total.toLocaleString()}</span>{' '}
              {focus.total === 1 ? unit.singular : unit.plural} · #{focus.rank} of {counts.length}
              {focus.agCount !== undefined && focus.agCount > 0 && ` · ${focus.agCount} from the state AG`}
            </p>
          </div>
        )}
      </div>

      {focus && focus.x === null && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{focus.name}</p>
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-red-300 tabular-nums">{focus.total.toLocaleString()}</span>{' '}
              {focus.total === 1 ? unit.singular : unit.plural} · ranked #{focus.rank} of {counts.length}
              {focus.agCount !== undefined && focus.agCount > 0 && ` · ${focus.agCount} from the state AG`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStateClick(focus.code)}
            className="shrink-0 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Open →
          </button>
        </div>
      )}

      {/* Legend: every swatch carries the real range of counts it covers. */}
      <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-3 text-xs text-slate-300">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-400">{unit.plural} per state</p>
          <div className="flex">
            {buckets.map((b) => (
              <div key={b.color} className="w-14 sm:w-16">
                <span className="block h-3" style={{ backgroundColor: b.color }} />
                <span className="mt-1 block text-center tabular-nums text-[11px] text-slate-300">
                  {b.min === b.max ? b.min.toLocaleString() : `${b.min.toLocaleString()}–${b.max.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
        <span className="flex items-center gap-1.5 pb-4">
          <span className="h-3 w-6 ring-1 ring-white/10" style={{ backgroundColor: NO_DATA }} />
          None recorded
        </span>
      </div>

      {offMap.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">DC &amp; territories</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {offMap.map((r) => (
              <button
                key={r.state}
                type="button"
                onClick={() => onStateClick(r.state)}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorFor(r.total) }} />
                {jurisdictionName(r.state)}
                <span className="font-semibold tabular-nums text-white">{r.total.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
