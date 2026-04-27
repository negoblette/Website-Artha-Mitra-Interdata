'use client';
import { motion } from 'framer-motion';

export default function ProductsHero({ data }) {
  const title = 'Technology Partners';
  const description = 'Discover our world-class technology partners and the solutions they power.';

  return (
    <section className="relative pt-50 pb-27 overflow-hidden">

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[rgb(19,27,94)] mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-[#111827] text-sm sm:text-base font-semibold leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}