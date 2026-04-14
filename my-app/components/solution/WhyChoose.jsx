'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function WhyChoose({ data }) {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#04063f_0%,#06095f_42%,#0a0b85_100%)]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-8" />
      <div className="absolute left-[-8%] top-10 h-64 w-64 rounded-full bg-cyan-300/18 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-[-3rem] h-80 w-80 rounded-full bg-indigo-200/12 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-200/14 bg-[#06095f]/58 p-8 shadow-[0_24px_80px_rgba(3,6,53,0.52)] backdrop-blur-xl sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.2),transparent_28%)]" />
            <div className="absolute inset-y-0 right-0 hidden w-[42%] border-l border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] lg:block" />

            <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div className="max-w-xl">
                <span className="inline-flex items-center rounded-full border border-cyan-200/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-50/90">
                  Why Choose AMI
                </span>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {data.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/88 sm:text-base">
                  {data.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-2xl border border-white/14 bg-white/10 px-4 py-3 text-white/90">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/70">Value</p>
                    <p className="mt-1 text-sm font-semibold">Tailored enterprise solutions</p>
                  </div>
                  <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/14 px-4 py-3 text-white/92">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/85">Focus</p>
                    <p className="mt-1 text-sm font-semibold">Reliable execution and support</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {data.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/14 bg-white/10 p-5 shadow-[0_16px_40px_rgba(2,6,39,0.32)] backdrop-blur-md"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_55%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-200/30 bg-cyan-300/18 text-cyan-50 shadow-lg shadow-cyan-900/20">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/55">
                          Benefit {String(i + 1).padStart(2, '0')}
                        </p>
                        <p className="text-sm leading-7 text-white/92">
                          {point}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="hidden lg:block">
                <div className="absolute bottom-6 right-6 rounded-full border border-cyan-200/16 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-50/75">
                  Trusted Partnership
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

