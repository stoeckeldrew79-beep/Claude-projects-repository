import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface NumberTickerProps {
  value: number;
  className?: string;
  delay?: number;
}

// Matches Magic UI's number-ticker component: counts up to `value` with a
// spring, starting the first time it scrolls into view.
export function NumberTicker({ value, className, delay = 0 }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  // Bottom margin only: a -50px margin on every side shrank the viewport
  // horizontally too, so on a phone a number sitting near the left edge never
  // counted as "in view" and stayed at 0.
  const isInView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' });

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, value, delay, motionValue]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = Math.round(latest).toLocaleString('en-US');
        }
      }),
    [springValue]
  );

  // A spring can come to rest a hair off target (72.6 rounds to 73), so the
  // settled number is always written as the exact value.
  useEffect(
    () =>
      springValue.on('animationComplete', () => {
        if (ref.current && motionValue.get() === value) {
          ref.current.textContent = value.toLocaleString('en-US');
        }
      }),
    [springValue, motionValue, value]
  );

  return <span ref={ref} className={className}>0</span>;
}
