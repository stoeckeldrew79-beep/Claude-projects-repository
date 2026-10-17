import { useEffect, useMemo, useRef, useState } from 'react';
import { geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoSphere } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
// Simplified (110m) Natural Earth country boundaries, bundled locally so the
// globe never depends on a runtime tile/map service.
import worldTopology from 'world-atlas/countries-110m.json';
import { CountryCount } from '../services/globe';
import { countryName } from '../utils/countries';
import { COUNTRIES } from '../utils/countryData';

// The globe used to be a three.js WebGL scene: a ~630 KB (172 KB gzipped)
// chunk, a full GPU context, ~1,000 sphere meshes and one canvas texture per
// country label, all re-rendered 60 times a second forever — on a phone that
// was most of the 45-second load. This is the same rotating globe drawn with
// d3-geo's orthographic projection on a single 2D canvas: a fraction of the
// download, no WebGL, it only draws while visible, and because every marker
// and label lives in screen space, labels can be collision-culled so Central
// America and the Caribbean no longer pile into an unreadable stack.

const TOPOLOGY = worldTopology as unknown as Topology;
const LAND = feature(TOPOLOGY, TOPOLOGY.objects.countries as GeometryCollection) as unknown as GeoJSON.FeatureCollection;
const BORDERS = mesh(TOPOLOGY, TOPOLOGY.objects.countries as GeometryCollection, (a, b) => a !== b);
const GRATICULE = geoGraticule10();
const SPHERE: GeoSphere = { type: 'Sphere' };

const COLORS = {
  oceanInner: '#13243b',
  oceanOuter: '#0a1424',
  land: '#1d324d',
  border: 'rgba(170, 196, 226, 0.38)',
  coast: 'rgba(170, 196, 226, 0.55)',
  graticule: 'rgba(100, 140, 190, 0.13)',
  marker: '#ff4d4d',
  markerCore: '#ffd2d0',
  label: 'rgba(235, 242, 250, 0.95)',
  labelMuted: 'rgba(170, 186, 206, 0.9)',
  selected: '#ffffff',
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
// Degrees per second of idle spin. Gentle enough to read labels while it turns.
const AUTO_ROTATE_DEG_PER_SEC = 4;

interface Marker {
  code: string;
  name: string;
  count: number;
  rank: number;
  lon: number;
  lat: number;
  // Radius in CSS pixels at zoom 1.
  baseRadius: number;
}

interface ScreenMarker extends Marker {
  x: number;
  y: number;
  r: number;
}

interface Hover {
  marker: Marker;
  x: number;
  y: number;
}

function rectsOverlap(a: DOMRectLike, b: DOMRectLike) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
interface DOMRectLike {
  x: number;
  y: number;
  w: number;
  h: number;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function Globe3D({
  data,
  onCountryClick,
}: {
  data: CountryCount[];
  onCountryClick?: (country: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCountryClickRef = useRef(onCountryClick);
  onCountryClickRef.current = onCountryClick;

  const [hover, setHover] = useState<Hover | null>(null);
  // Touch has no hover: a tap selects (showing the card below the globe) and
  // the card's button navigates, so a stray tap while spinning the globe never
  // yanks someone off the page.
  const [selected, setSelected] = useState<Marker | null>(null);
  const selectedRef = useRef<string | null>(null);
  selectedRef.current = selected?.code ?? null;
  const hoverRef = useRef<string | null>(null);
  hoverRef.current = hover?.marker.code ?? null;

  // Exposed to the zoom buttons; the effect below owns the real state.
  const controls = useRef<{ zoomBy: (f: number) => void; reset: () => void; redraw: () => void } | null>(null);

  const markers = useMemo<Marker[]>(() => {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    const max = Math.max(1, sorted[0]?.count ?? 1);
    const out: Marker[] = [];
    sorted.forEach((d, i) => {
      const info = COUNTRIES[d.country];
      if (!info) return;
      // Area-proportional (sqrt) sizing: a country with 4x the entries gets a
      // dot with 4x the area, not 4x the width. Small counts stay small dots
      // instead of 30 identical blobs crowding the Caribbean.
      out.push({
        code: d.country,
        name: countryName(d.country),
        count: d.count,
        rank: i + 1,
        lon: info.lon,
        lat: info.lat,
        baseRadius: 1.8 + 11 * Math.sqrt(d.count / max),
      });
    });
    return out;
  }, [data]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = prefersReducedMotion();
    // Open on the Americas, where most of the database sits, tilted a little.
    const rotation: [number, number] = [85, -18];
    let zoom = 1;
    let zoomTarget = 1;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let baseScale = 1;

    const projection = geoOrthographic().clipAngle(90).precision(0.6);
    const path = geoPath(projection, ctx);

    let screenMarkers: ScreenMarker[] = [];

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      baseScale = Math.min(width, height) / 2 - 8;
      needsDraw = true;
    }

    function draw(time: number) {
      projection
        .scale(baseScale * zoom)
        .translate([width / 2, height / 2])
        .rotate([rotation[0], rotation[1], 0]);
      const scale = baseScale * zoom;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      // Atmosphere halo, then the ocean disc.
      const cx = width / 2;
      const cy = height / 2;
      const halo = ctx!.createRadialGradient(cx, cy, scale * 0.96, cx, cy, scale * 1.12);
      halo.addColorStop(0, 'rgba(80, 140, 220, 0.28)');
      halo.addColorStop(1, 'rgba(80, 140, 220, 0)');
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(cx, cy, scale * 1.12, 0, Math.PI * 2);
      ctx!.fill();

      const ocean = ctx!.createRadialGradient(cx - scale * 0.35, cy - scale * 0.4, scale * 0.1, cx, cy, scale);
      ocean.addColorStop(0, COLORS.oceanInner);
      ocean.addColorStop(1, COLORS.oceanOuter);
      ctx!.beginPath();
      path(SPHERE);
      ctx!.fillStyle = ocean;
      ctx!.fill();

      ctx!.beginPath();
      path(GRATICULE);
      ctx!.lineWidth = 0.6;
      ctx!.strokeStyle = COLORS.graticule;
      ctx!.stroke();

      ctx!.beginPath();
      path(LAND);
      ctx!.fillStyle = COLORS.land;
      ctx!.fill();
      ctx!.lineWidth = 0.6;
      ctx!.strokeStyle = COLORS.coast;
      ctx!.stroke();

      ctx!.beginPath();
      path(BORDERS);
      ctx!.lineWidth = 0.5;
      ctx!.strokeStyle = COLORS.border;
      ctx!.stroke();

      // Markers on the near hemisphere only, faded toward the limb.
      const center: [number, number] = [-rotation[0], -rotation[1]];
      const markerScale = Math.sqrt(zoom);
      const pulse = reduceMotion ? 0.5 : (Math.sin(time / 900) + 1) / 2;
      screenMarkers = [];
      for (const m of markers) {
        const dist = geoDistance([m.lon, m.lat], center);
        if (dist > Math.PI / 2 - 0.03) continue;
        const p = projection([m.lon, m.lat]);
        if (!p) continue;
        const edgeFade = Math.min(1, (Math.PI / 2 - dist) / 0.35);
        const r = m.baseRadius * markerScale;
        screenMarkers.push({ ...m, x: p[0], y: p[1], r });

        const glowR = r * (2 + pulse * 0.5) + 3;
        const glow = ctx!.createRadialGradient(p[0], p[1], 0, p[0], p[1], glowR);
        glow.addColorStop(0, `rgba(255, 77, 77, ${0.45 * edgeFade})`);
        glow.addColorStop(1, 'rgba(255, 77, 77, 0)');
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(p[0], p[1], glowR, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.globalAlpha = 0.35 + 0.65 * edgeFade;
        ctx!.beginPath();
        ctx!.arc(p[0], p[1], r, 0, Math.PI * 2);
        ctx!.fillStyle = COLORS.marker;
        ctx!.fill();
        if (r > 4) {
          ctx!.beginPath();
          ctx!.arc(p[0], p[1], Math.max(1.2, r * 0.32), 0, Math.PI * 2);
          ctx!.fillStyle = COLORS.markerCore;
          ctx!.fill();
        }
        if (m.code === selectedRef.current || m.code === hoverRef.current) {
          ctx!.lineWidth = 2;
          ctx!.strokeStyle = COLORS.selected;
          ctx!.beginPath();
          ctx!.arc(p[0], p[1], r + 3, 0, Math.PI * 2);
          ctx!.stroke();
        }
        ctx!.globalAlpha = 1;
      }

      drawLabels(center);
    }

    // Screen-space label placement. Biggest counts claim space first; a
    // label is drawn only if its box clears every label already placed and
    // every larger marker. Labels near the limb (foreshortened, sliding off
    // the edge) are skipped. The result: as many labels as genuinely fit,
    // never a stack — zooming in reveals more.
    function drawLabels(center: [number, number]) {
      const narrow = width < 520;
      const fontSize = narrow ? 10.5 : 11.5;
      const maxLabels = Math.round((narrow ? 7 : 14) * Math.min(3, zoom));
      ctx!.font = `600 ${fontSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
      ctx!.textBaseline = 'middle';
      const placed: DOMRectLike[] = [];
      const pad = 3;
      let count = 0;
      const blockers = screenMarkers.map((m) => ({ x: m.x - m.r, y: m.y - m.r, w: m.r * 2, h: m.r * 2, code: m.code }));
      for (const m of screenMarkers) {
        if (count >= maxLabels) break;
        if (geoDistance([m.lon, m.lat], center) > (Math.PI / 2) * 0.7) continue;
        const name = m.name.length > 18 ? `${m.name.slice(0, 17)}…` : m.name;
        const countText = m.count.toLocaleString();
        const nameW = ctx!.measureText(name).width;
        const countW = ctx!.measureText(countText).width;
        const w = nameW + countW + 8 + pad * 2;
        const h = fontSize + pad * 2;
        // Try right, left, below, above the marker, in that order.
        const candidates: DOMRectLike[] = [
          { x: m.x + m.r + 4, y: m.y - h / 2, w, h },
          { x: m.x - m.r - 4 - w, y: m.y - h / 2, w, h },
          { x: m.x - w / 2, y: m.y + m.r + 3, w, h },
          { x: m.x - w / 2, y: m.y - m.r - 3 - h, w, h },
        ];
        const spot = candidates.find(
          (c) =>
            c.x >= 2 &&
            c.y >= 2 &&
            c.x + c.w <= width - 2 &&
            c.y + c.h <= height - 2 &&
            !placed.some((p) => rectsOverlap(c, p)) &&
            !blockers.some((b) => b.code !== m.code && rectsOverlap(c, b))
        );
        if (!spot) continue;
        placed.push(spot);
        count += 1;
        ctx!.fillStyle = 'rgba(8, 15, 28, 0.72)';
        ctx!.beginPath();
        ctx!.roundRect?.(spot.x, spot.y, spot.w, spot.h, 4);
        if (!ctx!.roundRect) ctx!.rect(spot.x, spot.y, spot.w, spot.h);
        ctx!.fill();
        ctx!.fillStyle = COLORS.label;
        ctx!.fillText(name, spot.x + pad, spot.y + h / 2 + 0.5);
        ctx!.fillStyle = '#ff8a85';
        ctx!.fillText(countText, spot.x + pad + nameW + 8, spot.y + h / 2 + 0.5);
      }
    }

    // ---- animation loop: runs only while visible and needed ----
    let rafId = 0;
    let running = false;
    let visible = true;
    let needsDraw = true;
    let lastTime = 0;
    let lastInteraction = -Infinity;
    let dragging = false;

    function frame(time: number) {
      rafId = 0;
      const dt = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      let animating = false;
      // The globe never stops turning: dragging and zooming add to the spin
      // rather than pausing it (drags apply as deltas, so the two combine).
      if (!reduceMotion) {
        rotation[0] += (AUTO_ROTATE_DEG_PER_SEC * dt) / 1000;
        animating = true;
      }
      if (Math.abs(zoomTarget - zoom) > 0.001) {
        zoom += (zoomTarget - zoom) * 0.2;
        animating = true;
      } else {
        zoom = zoomTarget;
      }
      // The marker glow pulses, so an idle visible globe keeps drawing unless
      // reduced motion is on.
      if (animating || needsDraw || !reduceMotion) {
        draw(time);
        needsDraw = false;
      }
      if (running && (animating || !reduceMotion || dragging)) rafId = requestAnimationFrame(frame);
    }

    function start() {
      running = visible && document.visibilityState === 'visible';
      if (running && !rafId) {
        lastTime = 0;
        rafId = requestAnimationFrame(frame);
      }
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }
    function kick() {
      needsDraw = true;
      if (!running) {
        // Offscreen or reduced-motion idle: draw once.
        if (visible) draw(performance.now());
        return;
      }
      if (!rafId) rafId = requestAnimationFrame(frame);
    }

    // Pause entirely when scrolled out of view or the tab is hidden — a
    // spinning canvas below the fold was burning a phone's CPU for nothing.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
        else stop();
      },
      { rootMargin: '100px' }
    );
    io.observe(container);
    const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());
    document.addEventListener('visibilitychange', onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(container);
    resize();
    start();
    kick();

    // ---- interaction ----
    let downX = 0;
    let downY = 0;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;
    let activePointer: number | null = null;

    function markerAt(x: number, y: number): ScreenMarker | null {
      let best: ScreenMarker | null = null;
      let bestD = Infinity;
      for (const m of screenMarkers) {
        const d = Math.hypot(m.x - x, m.y - y);
        // Generous touch target: small dots are hard to hit with a finger.
        if (d <= Math.max(m.r + 6, 14) && d < bestD) {
          best = m;
          bestD = d;
        }
      }
      return best;
    }

    function localPoint(e: PointerEvent | WheelEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onPointerDown(e: PointerEvent) {
      if (activePointer !== null) return;
      activePointer = e.pointerId;
      dragging = true;
      downX = lastX = e.clientX;
      downY = lastY = e.clientY;
      moved = 0;
      lastInteraction = performance.now();
      canvas!.setPointerCapture?.(e.pointerId);
      kick();
    }
    function onPointerMove(e: PointerEvent) {
      if (dragging && e.pointerId === activePointer) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        moved = Math.max(moved, Math.hypot(e.clientX - downX, e.clientY - downY));
        const k = 75 / (baseScale * zoom);
        rotation[0] += dx * k * 1.6;
        rotation[1] = Math.max(-75, Math.min(75, rotation[1] - dy * k * 1.6));
        lastInteraction = performance.now();
        kick();
        return;
      }
      if (e.pointerType === 'mouse') {
        const p = localPoint(e);
        const m = markerAt(p.x, p.y);
        canvas!.style.cursor = m ? 'pointer' : 'grab';
        setHover((prev) => {
          if (!m) return prev ? null : prev;
          if (prev && prev.marker.code === m.code && Math.abs(prev.x - p.x) < 2 && Math.abs(prev.y - p.y) < 2) return prev;
          return { marker: m, x: p.x, y: p.y };
        });
        if (!reduceMotion) return;
        kick();
      }
    }
    function onPointerUp(e: PointerEvent) {
      if (e.pointerId !== activePointer) return;
      activePointer = null;
      dragging = false;
      lastInteraction = performance.now();
      if (e.type === 'pointercancel' || moved > 6) return;
      const p = localPoint(e);
      const m = markerAt(p.x, p.y);
      if (!m) {
        setSelected(null);
        return;
      }
      if (e.pointerType === 'mouse') {
        onCountryClickRef.current?.(m.code);
      } else {
        setSelected(m);
        kick();
      }
    }
    function onPointerLeave() {
      setHover(null);
    }
    function onWheel(e: WheelEvent) {
      // Only hijack the wheel once someone is clearly interacting with the
      // globe (ctrl/pinch-zoom on trackpads always counts); a plain scroll
      // over it should still scroll the page.
      if (!e.ctrlKey && performance.now() - lastInteraction > 2500) return;
      e.preventDefault();
      zoomTarget = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomTarget * Math.exp(-e.deltaY * 0.0022)));
      lastInteraction = performance.now();
      kick();
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    controls.current = {
      zoomBy(f: number) {
        zoomTarget = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomTarget * f));
        lastInteraction = performance.now();
        kick();
      },
      reset() {
        zoomTarget = 1;
        rotation[0] = 85;
        rotation[1] = -18;
        lastInteraction = -Infinity;
        kick();
      },
      redraw: kick,
    };

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('wheel', onWheel);
      controls.current = null;
    };
  }, [markers]);

  // Selection ring changes need a redraw when the loop is idle.
  useEffect(() => {
    controls.current?.redraw();
  }, [selected]);

  const shownOnGlobe = markers.length;
  const maxCount = markers[0]?.count ?? 0;

  return (
    <div>
      <div
        ref={containerRef}
        className="relative mx-auto aspect-square w-full max-w-[560px] select-none"
        // Horizontal drags spin the globe; vertical swipes still scroll the
        // page, so the globe can never trap someone on a phone.
        style={{ touchAction: 'pan-y' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          role="img"
          aria-label={`Globe showing documented scam entries in ${shownOnGlobe} countries. The full ranked list follows.`}
        />
        {hover && (
          <div
            className="pointer-events-none absolute z-10 min-w-[150px] rounded-lg bg-slate-950/95 px-3 py-2 text-xs text-white shadow-xl ring-1 ring-white/10"
            style={{
              left: Math.min(hover.x + 14, (containerRef.current?.clientWidth ?? 400) - 170),
              top: hover.y + 14,
            }}
          >
            <p className="font-semibold">{hover.marker.name}</p>
            <p className="mt-0.5 text-slate-300">
              <span className="font-semibold text-red-300 tabular-nums">{hover.marker.count.toLocaleString()}</span>{' '}
              documented {hover.marker.count === 1 ? 'entry' : 'entries'} · #{hover.marker.rank}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">Click to browse</p>
          </div>
        )}
        <div className="absolute right-1 top-1 flex flex-col gap-1">
          {[
            ['+', 'Zoom in', () => controls.current?.zoomBy(1.5)],
            ['−', 'Zoom out', () => controls.current?.zoomBy(1 / 1.5)],
            ['⟲', 'Reset view', () => controls.current?.reset()],
          ].map(([label, aria, fn]) => (
            <button
              key={aria as string}
              type="button"
              aria-label={aria as string}
              onClick={fn as () => void}
              className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-base font-semibold text-slate-100 ring-1 ring-white/15 backdrop-blur hover:bg-white/20"
            >
              {label as string}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{selected.name}</p>
            <p className="text-xs text-slate-400">
              <span className="font-semibold text-red-300 tabular-nums">{selected.count.toLocaleString()}</span> documented{' '}
              {selected.count === 1 ? 'entry' : 'entries'} · ranked #{selected.rank} of {markers.length}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCountryClick?.(selected.code)}
            className="shrink-0 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            View entries →
          </button>
        </div>
      )}

      {/* Marker-size key, so dot size reads as a quantity. */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-400">
        <span>Dot area = documented entries</span>
        {[1, 0.25, 0.04].map((f) => {
          const n = Math.max(1, Math.round(maxCount * f));
          const r = 1.8 + 11 * Math.sqrt(n / Math.max(1, maxCount));
          return (
            <span key={f} className="flex items-center gap-1.5">
              <span className="inline-block rounded-full bg-[#ff4d4d]" style={{ width: r * 2, height: r * 2 }} />
              {n.toLocaleString()}
            </span>
          );
        })}
        <span className="hidden sm:inline">Drag to rotate · scroll after dragging, or use +/−, to zoom</span>
        <span className="sm:hidden">Swipe sideways to rotate · tap a dot</span>
      </div>
    </div>
  );
}
