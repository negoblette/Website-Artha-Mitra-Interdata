'use client';
import { motion } from 'framer-motion';
import { Mountain } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function KeyAdvantages({ data }) {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Key Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4 tracking-tight">
              {data.title}
            </h2>
            <p className="text-[#111827] text-sm max-w-2xl mx-auto leading-relaxed">
              {data.description}
            </p>
          </div>
        </AnimatedSection>

        {/* Advantages grid - 3 top, 2 bottom centered */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.slice(0, 3).map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass-card-glow rounded-2xl p-6 flex items-start gap-4 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#010268]/10 border border-[#010268]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#010268]/16 group-hover:border-[#010268]/30 transition-colors">
                    <Mountain className="text-[#111827]" size={24} />
                  </div>
                  <p className="text-[#111827] text-sm leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {data.items.slice(3).map((item, i) => (
              <AnimatedSection key={i + 3} delay={(i + 3) * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass-card-glow rounded-2xl p-6 flex items-start gap-4 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#010268]/10 border border-[#010268]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#010268]/16 group-hover:border-[#010268]/30 transition-colors">
                    <Mountain className="text-[#111827]" size={24} />
                  </div>
                  <p className="text-[#111827] text-sm leading-relaxed">
                    {item.text}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

