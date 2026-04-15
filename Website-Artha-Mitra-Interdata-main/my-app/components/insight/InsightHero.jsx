'use client';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

export default function InsightHero({ data }) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />
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
          <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            {data.subtitle}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] inline-block mb-5">
            {data.title}
          </h1>
          <p className="text-[#111827] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
