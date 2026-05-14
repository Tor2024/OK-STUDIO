import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * ScaleIn animation component
 * Элемент увеличивается от 0 до 100% при скролле
 */
export default function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className = ''
}: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{
        scale: 0.8,
        opacity: 0
      }}
      animate={
        isInView
          ? {
              scale: 1,
              opacity: 1
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.34, 1.56, 0.64, 1] // Brutalist bounce - легкий overshoot
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
