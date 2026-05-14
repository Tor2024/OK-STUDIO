import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

/**
 * FadeIn animation component
 * Элемент плавно появляется при скролле
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = ''
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    none: { y: 0, x: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              x: 0
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1] // Brutalist easing - резкое, но плавное
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
