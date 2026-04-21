'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function WhyChoose({ data }) {
  return (
    <section className="relative mb-30 overflow-hidden py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#eef3ff]/40 to-transparent" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-[0.06]" />
      <div className="absolute left-[-5rem] top-10 h-52 w-52 rounded-full bg-[#8cb8ff]/18 blur-3xl" />
      <div className="absolute bottom-[-4rem] right-[-2rem] h-72 w-72 rounded-full bg-[#0a0b85]/10 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-[2rem] border border-[#d9e3ff]/30 bg-[linear-gradient(135deg,rgba(8,20,82,0.97),rgba(10,11,133,0.92)_55%,rgba(11,53,138,0.85))] p-8 shadow-[0_24px_80px_rgba(3,6,53,0.32)] backdrop-blur-xl sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.18),transparent_32%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full transition-transform duration-1000 ease-in-out hover:translate-x-full pointer-events-none" />
            <div className="absolute -top-16 right-[-4rem] h-72 w-72 rounded-full bg-[#60a5fa]/18 blur-[90px]" />
            <div className="absolute -bottom-16 left-[-4rem] h-72 w-72 rounded-full bg-[#a5b4fc]/14 blur-[90px]" />
            <div className="absolute top-1/2 right-1/4 h-44 w-44 rounded-full bg-white/8 blur-[70px]" />

            <div className="absolute right-0 top-0 bottom-0 hidden w-[42%] opacity-10 lg:block">
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

            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="max-w-xl">
                <span className="inline-flex items-center rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/78">
                  Why Choose Us
                </span>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {data.title}
                </h2>
                <p className="mt-5 max-w-lg text-sm font-semibold leading-7 text-white/80 sm:text-base">
                  {data.description}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-md">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/68">
                      Delivery
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white/92">
                      Vendor-aligned implementation with local execution strength
                    </p>
                  </div>
                  <div className="rounded-2xl border border-cyan-200/18 bg-cyan-300/12 px-4 py-4 backdrop-blur-md">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/78">
                      Support
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white/92">
                      Long-term partnership from planning through maintenance
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {data.points.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/14 bg-white/10 p-5 shadow-[0_16px_40px_rgba(2,6,39,0.26)] backdrop-blur-md"
                    style={{
                      boxShadow:
                        '0 16px 40px rgba(2,6,39,0.26), 0 0 0 1px rgba(255,255,255,0.04)',
                    }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_52%)] opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
                    <div
                      className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-cyan-200/14 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                      style={{ opacity: 0.7 }}
                    />

                    <div className="relative flex items-start gap-4">
                      <motion.div
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-200/28 bg-cyan-300/18 text-cyan-50 shadow-lg shadow-cyan-900/20"
                        // animate={{
                        //   boxShadow: [
                        //     '0 0 0 rgba(103,232,249,0)',
                        //     '0 0 18px rgba(103,232,249,0.24)',
                        //     '0 0 0 rgba(103,232,249,0)',
                        //   ],
                        // }}
                        transition={{
                          duration: 3.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.35,
                        }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </motion.div>

                      <div>
                        {/* <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/55">
                          Achievement {String(i + 1).padStart(2, '0')}
                        </p> */}
                        <span
                          className="relative z-10 text-sm font-semibold leading-7 text-white/90"
                          style={{
                            animation: 'textGlow 4s ease-in-out infinite',
                            animationDelay: `${i * 0.7}s`,
                          }}
                        >
                          {point}
                        </span>
                      </div>
                    </div>
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
