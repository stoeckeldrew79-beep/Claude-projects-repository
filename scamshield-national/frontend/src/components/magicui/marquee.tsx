import { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
}

// Matches Magic UI's marquee component: duplicates the content N times
// and animates it with pure CSS (see the `animate-marquee` keyframes in
// tailwind.config.js) — no JS animation loop, no layout thrash.
export function Marquee({
  children,
  className = '',
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
}: MarqueeProps) {
  return (
    <div
      className={`group flex overflow-hidden p-2 [--duration:40s] [--gap:1.5rem] ${vertical ? 'flex-col' : 'flex-row'} ${className}`}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={`flex shrink-0 justify-around gap-[var(--gap)] ${vertical ? 'animate-marquee-vertical flex-col' : 'animate-marquee flex-row'} ${pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''} ${reverse ? '[animation-direction:reverse]' : ''}`}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
