'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, ChevronDown } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function ProgramCard({ program, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedSection delay={index * 0.1}>
      <motion.div
        layout
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="group relative h-full overflow-hidden rounded-[1.9rem] border border-white/60 bg-white/80 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-shadow hover:shadow-[0_30px_80px_rgba(10,11,133,0.15)]">
          <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,#eef3ff_0%,#dfe8ff_50%,#f8fbff_100%)]" />
          <div className="absolute -top-16 right-[-1rem] h-36 w-36 rounded-full bg-[#0a0b85]/10 blur-[60px] opacity-70 transition-opacity duration-700 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-5 flex gap-3 overflow-x-auto pb-1">
              {program.images.map((imageSrc, j) => (
                <div
                  key={j}
                  className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-white/70 bg-white/88 shadow-md shadow-[#0a0b85]/8 transition-shadow group-hover:shadow-lg"
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={`${program.name} image ${j + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f3f6ff]">
                      <Mountain className="text-[#0a0b85] transition-transform duration-500 group-hover:scale-110" size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0a0b85]">
                Program
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#111827] transition-colors group-hover:text-[#0a0b85]">{program.name}</h3>
            <p className={`mt-3 text-sm leading-7 text-[#475569] ${expanded ? '' : 'line-clamp-3'}`}>
              {program.description}
            </p>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 rounded-2xl border border-[#0a0b85]/8 bg-[#f8fbff] p-4">
                    <p className="text-xs leading-6 text-[#64748b]">
                      This program is part of AMI&apos;s commitment to community engagement and professional development in the IT industry across Indonesia.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#0a0b85]/10 bg-[#f3f6ff] px-3 py-1.5 text-[11px] font-semibold text-[#0a0b85] transition-colors hover:bg-[#e8eeff]"
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            >
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
              {expanded ? 'Less' : 'More details'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function ProgramsSection({ data }) {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-14 max-w-2xl">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block mb-2 tracking-tight">
              {data.title}
            </h2>
            <p className="text-[#475569] text-sm leading-7">{data.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.items.map((program, i) => (
            <ProgramCard key={i} program={program} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

