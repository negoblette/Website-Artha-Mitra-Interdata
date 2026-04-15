'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function WhyChoose({ data }) {
  return (
    <section className="relative py-20 mb-30 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="relative rounded-2xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] border border-white/10 shadow-[0_8px_32px_rgba(0,0,80,0.4)]">

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/15 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400/15 rounded-full blur-[80px]" />
            <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-[60px]" />

            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10">
              <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <line
                    key={i}
                    x1={i * 20}
                    y1="0"
                    x2={i * 20 + 100}
                    y2="300"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="0.5"
                  />
                ))}
              </svg>
            </div>

            <div className="relative">
              <span className="inline-block text-white/60 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                {data.title}
              </h2>
              <p className="text-white/80 text-sm font-semibold leading-relaxed max-w-xl mb-8">
                {data.description}
              </p>

              <div className="space-y-2">
                {data.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 group/item relative"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-300/70 mt-0.5 flex-shrink-0 relative z-10" />
                    <span
                      className="font-semibold text-sm relative z-10"
                      style={{
                        animation: `textGlow 4s ease-in-out infinite`,
                        animationDelay: `${i * 0.7}s`,
                      }}
                    >
                      {point}
                    </span>
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