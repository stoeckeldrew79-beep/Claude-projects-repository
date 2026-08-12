import { AnimatePresence, motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
}

const DEFAULT_VARIANTS: Variants = {
  hidden: { y: 6, opacity: 0, filter: 'blur(6px)' },
  visible: { y: 0, opacity: 1, filter: 'blur(0px)' },
};

// Matches Magic UI's blur-fade component: reveals children with a
// subtle upward blur-in, either immediately on mount or the first time
// it scrolls into view. Kept minimal (no custom variant prop) since
// this app only needs the default reveal, not Magic UI's full API.
export function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = '-50px',
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin as never });
  const isInView = !inView || inViewResult;

  const variants: Variants = {
    hidden: { ...DEFAULT_VARIANTS.hidden, y: yOffset },
    visible: DEFAULT_VARIANTS.visible,
  };

  return (
    <div ref={ref}>
      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          exit="hidden"
          variants={variants}
          transition={{ delay: 0.04 + delay, duration, ease: 'easeOut' }}
          className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
