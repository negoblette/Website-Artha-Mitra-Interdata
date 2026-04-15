'use client';
import { motion } from 'framer-motion';

export default function ProductsHero({ data }) {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-10" />
      <div className="absolute inset-0 grid-pattern opacity-[0.045]" />

      <div className="absolute top-20 right-1/4 w-72 h-72 rounded-full bg-[#010268]/[0.04] blur-[100px]" />
      <motion.div
        className="absolute bottom-0 left-1/3 w-80 h-60 bg-[#737373]/8 rounded-full blur-[120px]"
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
            Technology Partners
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] mb-4 tracking-tight">
            {data.title}
          </h1>
          <p className="text-[#111827] text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            {data.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
