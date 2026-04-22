'use client';
import { motion } from 'framer-motion';

export default function ContactHero() {
  return (
    <section className="relative pt-36 pb-20 overflow-hidden">
      {/* <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" /> */}
      <div className="absolute inset-0 mesh-gradient-accent opacity-10" />
      <div className="absolute inset-0 grid-pattern opacity-[0.045]" />

      {/* Decorative orbs */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-[#010268]/[0.04] rounded-full blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-48 h-48 bg-[#737373]/8 rounded-full blur-[60px]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#111827] mb-6 tracking-tight">
            Contact <span className="text-[#010268]">Us</span>
          </h1>
          <p className="text-[#111827] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Ready to optimize your IT infrastructure? We&#39;d love to hear from you. Reach out and let&#39;s discuss how we can help.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
