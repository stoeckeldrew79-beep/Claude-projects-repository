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
  const isInView = useInView(ref, { once: true, margin: '-50px' });

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

  return <span ref={ref} className={className}>0</span>;
}
