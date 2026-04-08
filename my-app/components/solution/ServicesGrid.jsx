'use client';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function ServicesGrid({ services }) {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Professional Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-3">
              Our Services
            </h2>
            <p className="text-[#111827] text-sm max-w-2xl mx-auto">
              End-to-end professional services from assessment to ongoing support.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = LucideIcons[service.icon] || LucideIcons.Cog;
            return (
              <AnimatedSection key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card-glow rounded-2xl p-6 h-full group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-[#737373]/20 flex items-center justify-center mb-4 group-hover:border-[#737373]/30 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#010268]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#111827] mb-2 group-hover:text-[#111827] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-[#111827] text-sm leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

