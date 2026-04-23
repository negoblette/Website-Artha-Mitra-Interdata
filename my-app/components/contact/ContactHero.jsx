'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const FOCUS_LINES = [
  'Infrastructure',
  'Cybersecurity',
  'Networking',
  'Enterprise Support',
];

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_48%,#f6f8ff_100%)]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-10" />
      <div className="absolute inset-0 grid-pattern opacity-[0.08]" />
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#0a0b85]/10 blur-[120px]" />
      <div className="absolute right-0 top-20 h-[30rem] w-[30rem] rounded-full bg-[#7c8cff]/12 blur-[140px]" />
      <div className="absolute bottom-0 left-1/2 h-[24rem] w-[48rem] -translate-x-1/2 rounded-full bg-[#010268]/5 blur-[140px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#0a0b85]/55">
            Get in touch
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-[#0f172a] sm:text-6xl lg:text-7xl">
            Let&#39;s build
            <span className="block bg-[linear-gradient(135deg,#0a0b85,#3651ff)] bg-clip-text text-transparent">
              a stronger connection
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#334155] sm:text-lg">
            Tell us what you are working on. We will help you find the right path, the right
            support, and the right next move without adding noise.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#0a0b85]/70">
            {FOCUS_LINES.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0a0b85]" />
                {item}
                {index < FOCUS_LINES.length - 1 ? <span className="text-[#c3cbea]">/</span> : null}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a0b85] transition-colors hover:text-[#2439d8]"
            >
              Scroll to form
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <span className="text-sm text-[#64748b]">
              or email us at <span className="font-semibold text-[#0f172a]">hello@amit.co.id</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[28rem] lg:min-h-[34rem]"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(10,11,133,0.16)_0%,rgba(10,11,133,0.08)_34%,rgba(10,11,133,0.02)_58%,transparent_74%)] blur-[2px]" />
          </div>

          <div className="absolute left-[8%] top-[14%] h-36 w-36 rounded-full border border-[#0a0b85]/12 bg-white/20 backdrop-blur-sm" />
          <div className="absolute right-[12%] top-[30%] h-24 w-24 rounded-full border border-[#7c8cff]/16 bg-white/18 backdrop-blur-sm" />
          <div className="absolute bottom-[18%] left-[18%] h-20 w-20 rounded-full border border-[#0a0b85]/14 bg-white/14 backdrop-blur-sm" />
          <div className="absolute inset-x-10 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(10,11,133,0.22),transparent)]" />
          <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0a0b85]/12" />
          <div className="absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c8cff]/18" />

          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[18%] top-[12%] text-[10px] font-semibold uppercase tracking-[0.36em] text-[#0a0b85]/55"
          >
            Connect
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0], x: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[14%] right-[10%] text-[10px] font-semibold uppercase tracking-[0.36em] text-[#64748b]"
          >
            Listen
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
