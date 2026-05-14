import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right';
  className?: string;
}

/**
 * SlideIn animation component
 * Элемент въезжает сбоку при скролле (brutalist style)
 */
export default function SlideIn({
  children,
  delay = 0,
  duration = 0.7,
  direction = 'left',
  className = ''
}: SlideInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{
        x: direction === 'left' ? -100 : 100,
        opacity: 0
      }}
      animate={
        isInView
          ? {
              x: 0,
              opacity: 1
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // Brutalist slide - быстрый старт, плавный финиш
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
