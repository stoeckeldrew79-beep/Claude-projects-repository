import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
// Simplified (110m) Natural Earth country boundaries — ~108KB, bundled
// locally so the globe never depends on a runtime tile/map service.
import worldTopology from 'world-atlas/countries-110m.json';
import { CountryCount } from '../services/globe';
import { countryName } from '../utils/countries';

// Approximate centroids for every country the seed data carries. A country
// missing from here cannot be drawn at all: it still appears in the legend
// with its count, but never on the sphere. That is how 97 of 110 countries
// came to be invisible while the legend listed them — the table had 13
// entries and the corpus had grown past it.
//
// Centroids, not precise geometry: a degree or two is imperceptible at the
// size these markers are drawn. Add a row here whenever a new country code
// enters the data, or it silently will not appear.
const COUNTRY_COORDS: Record<string, { lat: number; lon: number }> = {
  AE: { lat: 24, lon: 54 },
  AL: { lat: 41, lon: 20 },
  AM: { lat: 40.2, lon: 45 },
  AR: { lat: -34, lon: -64 },
  AT: { lat: 47.5, lon: 14.5 },
  AU: { lat: -25.3, lon: 133.8 },
  BD: { lat: 24, lon: 90 },
  BE: { lat: 50.6, lon: 4.7 },
  BG: { lat: 42.8, lon: 25.5 },
  BH: { lat: 26, lon: 50.6 },
  BO: { lat: -17, lon: -65 },
  BR: { lat: -10, lon: -52 },
  BS: { lat: 24.5, lon: -77.5 },
  BW: { lat: -22.3, lon: 24.7 },
  BZ: { lat: 17.2, lon: -88.7 },
  CA: { lat: 56.1, lon: -106.3 },
  CH: { lat: 46.8, lon: 8.2 },
  CI: { lat: 7.5, lon: -5.5 },
  CL: { lat: -35, lon: -71 },
  CM: { lat: 6, lon: 12.5 },
  CN: { lat: 35, lon: 105 },
  CO: { lat: 4, lon: -73 },
  CR: { lat: 10, lon: -84 },
  CY: { lat: 35, lon: 33 },
  CZ: { lat: 49.8, lon: 15.5 },
  DE: { lat: 51.2, lon: 10.4 },
  DK: { lat: 56, lon: 10 },
  DO: { lat: 19, lon: -70.7 },
  EC: { lat: -1.5, lon: -78.5 },
  EE: { lat: 58.7, lon: 25.5 },
  EG: { lat: 27, lon: 30 },
  ES: { lat: 40, lon: -3.7 },
  ET: { lat: 8, lon: 38.7 },
  FI: { lat: 64, lon: 26 },
  FJ: { lat: -17.7, lon: 178 },
  FR: { lat: 46.6, lon: 2.2 },
  GB: { lat: 55, lon: -3.4 },
  GE: { lat: 42, lon: 43.5 },
  GH: { lat: 8, lon: -1 },
  GR: { lat: 39, lon: 22 },
  GT: { lat: 15.5, lon: -90.3 },
  HK: { lat: 22.3, lon: 114.2 },
  HR: { lat: 45.1, lon: 15.2 },
  HU: { lat: 47, lon: 19.5 },
  ID: { lat: -2.5, lon: 118 },
  IE: { lat: 53.4, lon: -8.2 },
  IL: { lat: 31.5, lon: 34.8 },
  IN: { lat: 22, lon: 79 },
  IS: { lat: 65, lon: -18 },
  IT: { lat: 42.8, lon: 12.8 },
  JM: { lat: 18.1, lon: -77.3 },
  JO: { lat: 31, lon: 36.5 },
  JP: { lat: 36.2, lon: 138.3 },
  KE: { lat: 0.5, lon: 37.9 },
  KH: { lat: 12.5, lon: 105 },
  KR: { lat: 36.5, lon: 127.8 },
  KW: { lat: 29.3, lon: 47.7 },
  KZ: { lat: 48, lon: 68 },
  LA: { lat: 18, lon: 105 },
  LB: { lat: 33.9, lon: 35.9 },
  LK: { lat: 7.5, lon: 80.7 },
  LT: { lat: 55.2, lon: 23.9 },
  LU: { lat: 49.8, lon: 6.1 },
  LV: { lat: 56.9, lon: 24.6 },
  MA: { lat: 32, lon: -6 },
  MD: { lat: 47.2, lon: 28.5 },
  MK: { lat: 41.6, lon: 21.7 },
  MM: { lat: 21, lon: 96 },
  MN: { lat: 46.9, lon: 103.8 },
  MT: { lat: 35.9, lon: 14.4 },
  MU: { lat: -20.3, lon: 57.6 },
  MX: { lat: 23.6, lon: -102.5 },
  MY: { lat: 4.2, lon: 109.5 },
  NA: { lat: -22, lon: 17.2 },
  NG: { lat: 9.1, lon: 8.7 },
  NL: { lat: 52.1, lon: 5.3 },
  NO: { lat: 62, lon: 10 },
  NP: { lat: 28.4, lon: 84.1 },
  NZ: { lat: -41, lon: 174 },
  PA: { lat: 8.5, lon: -80.1 },
  PE: { lat: -9.2, lon: -75 },
  PH: { lat: 12.9, lon: 121.8 },
  PK: { lat: 30.4, lon: 69.3 },
  PL: { lat: 52, lon: 19.4 },
  PT: { lat: 39.6, lon: -8 },
  QA: { lat: 25.3, lon: 51.2 },
  RO: { lat: 45.9, lon: 25 },
  RS: { lat: 44, lon: 21 },
  RW: { lat: -1.9, lon: 29.9 },
  SA: { lat: 24, lon: 45 },
  SE: { lat: 62, lon: 15 },
  SG: { lat: 1.35, lon: 103.8 },
  SI: { lat: 46.1, lon: 14.8 },
  SK: { lat: 48.7, lon: 19.7 },
  SN: { lat: 14.5, lon: -14.5 },
  TH: { lat: 15, lon: 101 },
  TR: { lat: 39, lon: 35.2 },
  TT: { lat: 10.7, lon: -61.2 },
  TW: { lat: 23.7, lon: 121 },
  TZ: { lat: -6.4, lon: 34.9 },
  UA: { lat: 49, lon: 32 },
  UG: { lat: 1.4, lon: 32.3 },
  US: { lat: 39.8, lon: -98.6 },
  UY: { lat: -32.5, lon: -55.8 },
  UZ: { lat: 41.4, lon: 64.6 },
  VE: { lat: 6.4, lon: -66.6 },
  VN: { lat: 16, lon: 106 },
  ZA: { lat: -29, lon: 24 },
  ZM: { lat: -13.1, lon: 27.8 },
  ZW: { lat: -19, lon: 29.9 },
};

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// A graticule (lat/long grid) globe rather than a textured world map —
// no external texture asset needed, and it reads as a deliberate
// "threat intelligence" data-viz choice rather than a decorative globe.
function buildGraticuleSphere(radius: number): THREE.LineSegments {
  const points: THREE.Vector3[] = [];
  const segments = 48;

  for (let lat = -80; lat <= 80; lat += 20) {
    for (let i = 0; i < segments; i++) {
      const lon1 = (i / segments) * 360 - 180;
      const lon2 = ((i + 1) / segments) * 360 - 180;
      points.push(latLonToVector3(lat, lon1, radius), latLonToVector3(lat, lon2, radius));
    }
  }
  for (let lon = -180; lon < 180; lon += 20) {
    for (let i = 0; i < segments; i++) {
      const lat1 = (i / segments) * 180 - 90;
      const lat2 = ((i + 1) / segments) * 180 - 90;
      points.push(latLonToVector3(lat1, lon, radius), latLonToVector3(lat2, lon, radius));
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x2a4a6b, transparent: true, opacity: 0.22 });
  return new THREE.LineSegments(geometry, material);
}

// Real country/coastline borders traced in silver — the "extreme
// intelligence" ops-center look, rather than a blank sphere with only a
// lat/long grid. topojson's mesh() dedupes shared borders so each line
// between two countries is drawn once, not twice.
function buildCountryBorders(radius: number): THREE.LineSegments {
  const topology = worldTopology as unknown as Topology;
  const countries = topology.objects.countries as GeometryCollection;
  const borders = mesh(topology, countries);

  const points: THREE.Vector3[] = [];
  for (const line of borders.coordinates) {
    for (let i = 0; i < line.length - 1; i++) {
      const [lon1, lat1] = line[i];
      const [lon2, lat2] = line[i + 1];
      points.push(latLonToVector3(lat1, lon1, radius), latLonToVector3(lat2, lon2, radius));
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xc9d6e6, transparent: true, opacity: 0.8 });
  return new THREE.LineSegments(geometry, material);
}

// Country name rendered as faint, letter-spaced map lettering with no
// background — reads as text printed on the globe itself (like an atlas
// label) rather than a floating UI tag sitting on top of it.
function createCountryLabel(text: string): THREE.Sprite {
  const label = text.toUpperCase();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const fontSize = 30;
  const letterSpacing = 2;
  const font = `500 ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.font = font;
  const textWidth = ctx.measureText(label).width + letterSpacing * label.length;
  const padding = 10;
  canvas.width = Math.ceil(textWidth + padding * 2);
  canvas.height = Math.ceil(fontSize * 1.6);
  const w = canvas.width;
  const h = canvas.height;

  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(203, 216, 232, 0.65)';
  // Manual letter-spacing: fillText has no built-in tracking control.
  let x = (w - textWidth) / 2;
  for (const char of label) {
    ctx.fillText(char, x, h / 2 + 1);
    x += ctx.measureText(char).width + letterSpacing;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  const labelHeight = 0.085;
  sprite.scale.set(labelHeight * (w / h), labelHeight, 1);
  return sprite;
}

export function Globe3D({
  data,
  onCountryClick,
}: {
  data: CountryCount[];
  onCountryClick?: (country: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCountryClickRef = useRef(onCountryClick);
  onCountryClickRef.current = onCountryClick;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = 2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeRoot = new THREE.Group();
    scene.add(globeRoot);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.985, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x0f1a2b })
    );
    globeRoot.add(core);
    globeRoot.add(buildGraticuleSphere(radius));
    globeRoot.add(buildCountryBorders(radius * 1.001));

    const maxCount = Math.max(1, ...data.map((d) => d.count));
    const markerGroup = new THREE.Group();
    const clickTargets: THREE.Mesh[] = [];
    const pulsingGlows: { mesh: THREE.Mesh; baseScale: number; phase: number }[] = [];
    for (const entry of data) {
      const coords = COUNTRY_COORDS[entry.country];
      if (!coords) continue;
      const position = latLonToVector3(coords.lat, coords.lon, radius);
      const markerRadius = 0.035 + (entry.count / maxCount) * 0.09;

      // Slightly oversized invisible hit-target sphere makes the marker
      // easier to click than the visible dot alone would allow.
      const hitTarget = new THREE.Mesh(
        new THREE.SphereGeometry(markerRadius * 2.5, 12, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitTarget.position.copy(position);
      hitTarget.userData.country = entry.country;
      markerGroup.add(hitTarget);
      clickTargets.push(hitTarget);

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(markerRadius, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff5750 })
      );
      marker.position.copy(position);
      markerGroup.add(marker);

      // Additive blending makes the glow read as an actual light bloom
      // against the dark globe rather than a flat translucent disc — kept
      // subtle since a strong pulse reads as flashing rather than glowing.
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(markerRadius * 2.2, 16, 16),
        new THREE.MeshBasicMaterial({
          color: 0xff4b46,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      glow.position.copy(position);
      markerGroup.add(glow);
      pulsingGlows.push({ mesh: glow, baseScale: markerRadius * 2.2, phase: Math.random() * Math.PI * 2 });

      // Sits flush on the sphere just south of the dot, like text printed
      // on a map, rather than floating above it as a UI tag.
      const label = createCountryLabel(countryName(entry.country));
      const labelPosition = latLonToVector3(coords.lat - 4.5, coords.lon, radius * 1.003);
      label.position.copy(labelPosition);
      markerGroup.add(label);
    }
    globeRoot.add(markerGroup);

    let animationId: number;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;
    let dragDistance = 0;
    const rotationTarget = { x: 0.15, y: 0 };
    globeRoot.rotation.x = rotationTarget.x;

    const MIN_ZOOM = 2.6;
    const MAX_ZOOM = 8;
    let zoomTarget = camera.position.z;
    const clampZoom = (z: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    const CLICK_DRAG_THRESHOLD = 6;

    // Two-finger pinch tracking, layered on top of the existing single-
    // pointer drag-to-rotate rather than replacing it.
    const activePointers = new Map<number, { x: number; y: number }>();
    let isPinching = false;
    let pinchStartDist = 0;
    let pinchStartZoom = 0;
    let hadMultiTouch = false;
    function pointerDist(a: { x: number; y: number }, b: { x: number; y: number }) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      zoomTarget = clampZoom(zoomTarget + e.deltaY * 0.0035);
    }

    function onPointerDown(e: PointerEvent) {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (activePointers.size >= 2) {
        hadMultiTouch = true;
        isPinching = true;
        dragging = false;
        const [a, b] = [...activePointers.values()];
        pinchStartDist = pointerDist(a, b);
        pinchStartZoom = zoomTarget;
        return;
      }
      dragging = true;
      hadMultiTouch = false;
      lastX = e.clientX;
      lastY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      dragDistance = 0;
    }
    function onPointerMove(e: PointerEvent) {
      if (activePointers.has(e.pointerId)) {
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }
      if (isPinching && activePointers.size >= 2) {
        const [a, b] = [...activePointers.values()];
        const dist = pointerDist(a, b);
        if (pinchStartDist > 0) {
          zoomTarget = clampZoom(pinchStartZoom * (pinchStartDist / dist));
        }
        return;
      }
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      dragDistance += Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY);
      rotationTarget.y += dx * 0.005;
      rotationTarget.x = Math.max(-1, Math.min(1, rotationTarget.x + dy * 0.005));
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onPointerUp(e: PointerEvent) {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) isPinching = false;
      if (activePointers.size > 0) return;

      dragging = false;
      if (hadMultiTouch || dragDistance > CLICK_DRAG_THRESHOLD || !onCountryClickRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNDC, camera);
      const hits = raycaster.intersectObjects(clickTargets, false);
      if (hits.length > 0) {
        const country = hits[0].object.userData.country as string;
        onCountryClickRef.current(country);
      }
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    function animate(time: number) {
      if (!dragging) rotationTarget.y += 0.0015;
      globeRoot.rotation.y = rotationTarget.y;
      globeRoot.rotation.x = rotationTarget.x;
      camera.position.z += (zoomTarget - camera.position.z) * 0.15;

      const t = time * 0.0011;
      for (const { mesh, phase } of pulsingGlows) {
        const pulse = 1 + Math.sin(t + phase) * 0.18;
        mesh.scale.setScalar(pulse);
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.12 + (Math.sin(t + phase) * 0.5 + 0.5) * 0.2;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);

    function handleResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [data]);

  return (
    <div>
      <div ref={containerRef} className="h-[420px] w-full cursor-grab active:cursor-grabbing" />
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {data.map((d) => (
          <div key={d.country} className="flex items-center gap-1.5 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-[#e34948]" />
            {countryName(d.country)} · {d.count}
          </div>
        ))}
      </div>
    </div>
  );
}
