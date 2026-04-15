'use client';
import { motion } from 'framer-motion';

export default function ActivitiesHero({ data }) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-10" />
      <div className="absolute inset-0 grid-pattern opacity-[0.045]" />

      <motion.div
        className="absolute top-16 right-0 w-96 h-64 bg-[#010268]/[0.04] rounded-full blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-72 h-72 bg-[#737373]/8 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Activities
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] mb-3 tracking-tight">
            {data.title}
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#010268] mb-6">
            {data.subtitle}
          </h2>
          <p className="text-[#111827] text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            {data.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
