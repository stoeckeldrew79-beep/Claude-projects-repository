import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
// Simplified (110m) Natural Earth country boundaries — ~108KB, bundled
// locally so the globe never depends on a runtime tile/map service.
import worldTopology from 'world-atlas/countries-110m.json';
import { CountryCount } from '../services/globe';
import { countryName } from '../utils/countries';

// Approximate country centroids for the small set of countries the site
// currently has data for (see utils/countries.ts). Not a full geo
// database — extend this alongside COUNTRY_NAMES as real international
// data grows, rather than pre-building coverage for countries with zero
// records.
const COUNTRY_COORDS: Record<string, { lat: number; lon: number }> = {
  US: { lat: 39.8, lon: -98.6 },
  CA: { lat: 56.1, lon: -106.3 },
  GB: { lat: 55.0, lon: -3.4 },
  AU: { lat: -25.3, lon: 133.8 },
  NZ: { lat: -41.0, lon: 174.0 },
  IE: { lat: 53.4, lon: -8.2 },
  SG: { lat: 1.35, lon: 103.8 },
  DE: { lat: 51.2, lon: 10.4 },
  JP: { lat: 36.2, lon: 138.3 },
  NL: { lat: 52.1, lon: 5.3 },
  IN: { lat: 22.0, lon: 79.0 },
  FR: { lat: 46.6, lon: 2.2 },
  SE: { lat: 62.0, lon: 15.0 },
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
        new THREE.MeshBasicMaterial({ color: 0xe34948 })
      );
      marker.position.copy(position);
      markerGroup.add(marker);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(markerRadius * 2.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xe34948, transparent: true, opacity: 0.18 })
      );
      glow.position.copy(position);
      markerGroup.add(glow);
      pulsingGlows.push({ mesh: glow, baseScale: markerRadius * 2.2, phase: Math.random() * Math.PI * 2 });
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

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    const CLICK_DRAG_THRESHOLD = 6;

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      dragDistance = 0;
    }
    function onPointerMove(e: PointerEvent) {
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
      dragging = false;
      if (dragDistance > CLICK_DRAG_THRESHOLD || !onCountryClickRef.current) return;

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

    function animate(time: number) {
      if (!dragging) rotationTarget.y += 0.0015;
      globeRoot.rotation.y = rotationTarget.y;
      globeRoot.rotation.x = rotationTarget.x;

      const t = time * 0.002;
      for (const { mesh, phase } of pulsingGlows) {
        const pulse = 1 + Math.sin(t + phase) * 0.35;
        mesh.scale.setScalar(pulse);
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.1 + (Math.sin(t + phase) * 0.5 + 0.5) * 0.18;
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
