"use client";

import { useEffect, useRef } from "react";

type Blob = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: string;
};

export default function AuroraCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const colors = ["#7c5cff", "#5ce1ff", "#4a3aa8"];
    const blobs: Blob[] = Array.from({ length: 3 }, (_, i) => ({
      x: width * (0.25 + i * 0.25),
      y: height * (0.3 + (i % 2) * 0.3),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.min(width, height) * (0.32 + i * 0.05),
      hue: colors[i % colors.length],
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.filter = "blur(60px)";
      for (const b of blobs) {
        if (!reduceMotion) {
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < b.r * 0.3 || b.x > width - b.r * 0.3) b.vx *= -1;
          if (b.y < b.r * 0.3 || b.y > height - b.r * 0.3) b.vy *= -1;
        }
        const gradient = ctx.createRadialGradient(
          b.x,
          b.y,
          0,
          b.x,
          b.y,
          b.r
        );
        gradient.addColorStop(0, b.hue + "55");
        gradient.addColorStop(1, b.hue + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
