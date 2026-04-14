'use client';
import { Eye, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisionMission({ vision, mission }) {
  return (
    <section data-no-reveal="true" className="relative overflow-visible py-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0a0b85]/12 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#0a0b85] shadow-[0_8px_24px_rgba(10,11,133,0.08)] backdrop-blur-sm">
            Core Direction
          </span>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[#0a0b85] sm:text-5xl">
            Vision & Mission
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#111827]/75 sm:text-base">
            The principles that shape how we grow, serve, and create long-term value for every partnership we build.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <motion.article
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="vision-card relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-[#d6ddff] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(234,240,255,0.96)_100%)] p-7 shadow-[0_20px_48px_rgba(10,11,133,0.12)] md:min-h-[420px] md:p-9"
          >
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#bac9ff]/45 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(10,11,133,0.28),transparent)]" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-[#0a0b85]/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a0b85]">
                    Our Vision
                  </span>
                  <h3 className="mt-4 text-3xl font-black text-[#0a0b85]">Vision</h3>
                </div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0a0b85] text-white shadow-[0_16px_28px_rgba(10,11,133,0.22)]">
                  <Eye size={24} />
                </span>
              </div>

              <div className="mt-8 h-px w-full bg-[linear-gradient(90deg,rgba(10,11,133,0.18),rgba(10,11,133,0.04))]" />

              <p className="relative mt-8 text-[15px] leading-8 text-[#111827]/82 md:text-base">
                {vision}
              </p>

              <div className="mt-auto pt-8">
                <div className="rounded-2xl border border-[#0a0b85]/10 bg-white/80 px-4 py-3 text-left text-sm font-semibold text-[#0a0b85]/80 shadow-[0_10px_24px_rgba(10,11,133,0.06)]">
                  A long-view perspective that keeps our innovation aligned with client growth.
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="vision-card relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-[#d6ddff] bg-[linear-gradient(180deg,#0a0b85_0%,#10248f_58%,#15349d_100%)] p-7 text-white shadow-[0_24px_54px_rgba(10,11,133,0.26)] md:min-h-[420px] md:p-9"
          >
            <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
                    Our Mission
                  </span>
                  <h3 className="mt-4 text-3xl font-black text-white">Mission</h3>
                </div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white shadow-[0_16px_28px_rgba(0,0,0,0.16)] ring-1 ring-white/15">
                  <Target size={24} />
                </span>
              </div>

              <div className="mt-8 h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.28),rgba(255,255,255,0.06))]" />

              <p className="relative mt-8 text-[15px] leading-8 text-white/88 md:text-base">
                {mission}
              </p>

              <div className="mt-auto pt-8">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left text-sm font-semibold text-white/80 shadow-[0_10px_24px_rgba(0,0,0,0.14)] backdrop-blur-sm">
                  A practical commitment to service excellence, partnership, and measurable impact.
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
