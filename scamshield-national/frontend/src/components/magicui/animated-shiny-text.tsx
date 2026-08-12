import { ReactNode } from 'react';

// Matches Magic UI's animated-shiny-text: a background-clip text
// shimmer driven by a CSS keyframe on background-position.
export function AnimatedShinyText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-[length:200%_100%] animate-shiny-text bg-gradient-to-r from-slate-500 via-slate-900 to-slate-500 ${className}`}
    >
      {children}
    </span>
  );
}
