'use client';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function ServicesGrid({ services }) {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="relative z-10 mb-14 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-14">
            <h2 className="mt-5 text-4xl font-black tracking-tight text-[rgb(13,27,94)] sm:text-5xl">
              Services
            </h2>
            <p className="text-[#111827] text-[13px] font-base sm:text-lg max-w-2xl mx-auto">
              End-to-end professional services from assessment to ongoing support.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const Icon = LucideIcons[service.icon] || LucideIcons.Cog;
            return (
              <AnimatedSection key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="group cursor-pointer"
                >
                  <div className="rounded-2xl min-h-[260px] p-6 relative overflow-hidden h-full bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] border border-white/10 group-hover:border-white/25 transition-all duration-500 group-hover:shadow-[0_8px_32px_rgba(0,0,80,0.4),0_0_0_1px_rgba(255,255,255,0.08)]">

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>

                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 group-hover:bg-white/15 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-[20px] font-bold text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-white/80 font-base text-[17px] leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
