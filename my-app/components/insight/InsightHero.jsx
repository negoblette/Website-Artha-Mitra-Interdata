'use client';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

export default function InsightHero({ data }) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0b85_0%,#0f1aa8_45%,#111827_100%)]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-10" />
      <div className="absolute inset-0 grid-pattern opacity-[0.045]" />

      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-[#010268]/[0.04] rounded-full blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-60 bg-[#737373]/8 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <AnimatedSection>
          <div className="mb-4">
            <span className="inline-block text-[#d9dbde] text-xs font-semibold tracking-[0.3em] uppercase">
              {data.subtitle}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white inline-block mb-5">
            {data.title}
          </h1>
          <p className="text-white text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
