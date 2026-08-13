import { useEffect, useRef } from 'react';
import * as THREE from 'three';
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
  const material = new THREE.LineBasicMaterial({ color: 0x2a4a6b, transparent: true, opacity: 0.5 });
  return new THREE.LineSegments(geometry, material);
}

export function Globe3D({ data }: { data: CountryCount[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

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

    const maxCount = Math.max(1, ...data.map((d) => d.count));
    const markerGroup = new THREE.Group();
    for (const entry of data) {
      const coords = COUNTRY_COORDS[entry.country];
      if (!coords) continue;
      const position = latLonToVector3(coords.lat, coords.lon, radius);
      const markerRadius = 0.035 + (entry.count / maxCount) * 0.09;

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
    }
    globeRoot.add(markerGroup);

    let animationId: number;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const rotationTarget = { x: 0.15, y: 0 };
    globeRoot.rotation.x = rotationTarget.x;

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      rotationTarget.y += dx * 0.005;
      rotationTarget.x = Math.max(-1, Math.min(1, rotationTarget.x + dy * 0.005));
      lastX = e.clientX;
      lastY = e.clientY;
    }
    function onPointerUp() {
      dragging = false;
    }
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    function animate() {
      if (!dragging) rotationTarget.y += 0.0015;
      globeRoot.rotation.y = rotationTarget.y;
      globeRoot.rotation.x = rotationTarget.x;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

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
