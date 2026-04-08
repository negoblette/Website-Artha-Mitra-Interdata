'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function WhyChoose({ data }) {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="relative glass-card-glow rounded-2xl p-8 sm:p-12 overflow-hidden">
            {/* Background mesh effect */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15">
              <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line
                    key={i}
                    x1={i * 20}
                    y1="0"
                    x2={i * 20 + 100}
                    y2="300"
                    stroke="rgba(168,85,247,0.25)"
                    strokeWidth="0.5"
                  />
                ))}
              </svg>
            </div>

            <div className="relative">
              <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4 tracking-tight">
                {data.title}
              </h2>
              <p className="text-[#111827] text-sm leading-relaxed max-w-xl mb-8">
                {data.description}
              </p>

              <div className="space-y-3">
                {data.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#010268] mt-0.5 flex-shrink-0" />
                    <span className="text-[#111827] text-sm">{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

