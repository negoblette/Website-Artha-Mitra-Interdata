'use client';
import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.7,
  once = true,
}) {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    up: { y: 60, opacity: 0 },
    down: { y: -60, opacity: 0 },
    left: { x: -60, opacity: 0 },
    right: { x: 60, opacity: 0 },
    fade: { opacity: 0 },
  };

  const initialState = shouldReduceMotion
    ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }
    : { ...(variants[direction] || variants.up), filter: 'blur(4px)' };

  return (
    <motion.div
      initial={initialState}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount: 0.18, margin: '0px 0px -8% 0px' }}
      transition={{ duration: shouldReduceMotion ? 0 : duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
