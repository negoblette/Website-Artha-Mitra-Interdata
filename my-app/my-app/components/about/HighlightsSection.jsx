'use client';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

export default function HighlightsSection({ data }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#ffffff]" />
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 border-y border-white/12 py-8">
          {data.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <motion.div whileHover={{ y: -4 }} className="group h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-[#737373] tracking-[0.2em] uppercase">
                    {`0${i + 1}`}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </div>
                <p className="text-[#111827] text-sm leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

