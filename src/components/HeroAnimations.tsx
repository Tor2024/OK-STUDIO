import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode } from 'react';

// Типы анимаций
export type AnimationType = 
  | 'fadeIn'
  | 'fadeSlideUp'
  | 'fadeSlideDown'
  | 'fadeSlideLeft'
  | 'fadeSlideRight'
  | 'scaleIn'
  | 'scaleBounce'
  | 'rotateIn'
  | 'typewriter'
  | 'glitch'
  | 'wave'
  | 'elastic'
  | 'none';

// Варианты анимаций
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: 'easeOut' }
  },
  fadeSlideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  },
  fadeSlideDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  },
  fadeSlideLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  },
  fadeSlideRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
  },
  scaleBounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { 
      duration: 0.8, 
      ease: [0.68, -0.55, 0.265, 1.55],
      scale: {
        type: 'spring',
        damping: 10,
        stiffness: 100
      }
    }
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -10, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.7, ease: 'easeOut' }
  },
  elastic: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      duration: 1
    }
  },
  wave: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      repeat: 0
    }
  },
  none: {
    initial: {},
    animate: {},
    transition: {}
  }
};

// Описания анимаций для админ панели
export const animationDescriptions: Record<AnimationType, string> = {
  fadeIn: 'Плавное появление',
  fadeSlideUp: 'Появление снизу вверх',
  fadeSlideDown: 'Появление сверху вниз',
  fadeSlideLeft: 'Появление справа налево',
  fadeSlideRight: 'Появление слева направо',
  scaleIn: 'Увеличение с появлением',
  scaleBounce: 'Упругое увеличение (bounce)',
  rotateIn: 'Появление с поворотом',
  typewriter: 'Эффект печатной машинки',
  glitch: 'Глитч эффект (техно)',
  wave: 'Волновое появление',
  elastic: 'Эластичное появление (spring)',
  none: 'Без анимации'
};

interface AnimatedElementProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function AnimatedElement({ 
  children, 
  animation = 'fadeIn', 
  delay = 0,
  className = '',
  as = 'div'
}: AnimatedElementProps) {
  if (animation === 'none') {
    const Component = as;
    return <Component className={className}>{children}</Component>;
  }

  const variant = animationVariants[animation];
  const MotionComponent = motion[as] as any;

  return (
    <MotionComponent
      initial={variant.initial}
      animate={variant.animate}
      transition={{ ...variant.transition, delay }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

// Специальный компонент для эффекта печатной машинки
export function TypewriterText({ text, className = '' }: { text: string; className?: string }) {
  const letters = text.split('');
  
  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: index * 0.05 }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

// Глитч эффект
export function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 1, 0.8, 1, 0.9, 1],
        x: [0, -2, 2, -1, 1, 0],
        skew: [0, -2, 2, -1, 1, 0]
      }}
      transition={{ 
        duration: 0.6,
        times: [0, 0.1, 0.2, 0.5, 0.8, 1]
      }}
    >
      {text}
    </motion.span>
  );
}
