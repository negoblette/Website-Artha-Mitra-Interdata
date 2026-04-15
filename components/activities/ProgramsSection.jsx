'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, ChevronDown } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function ProgramCard({ program, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedSection delay={index * 0.1}>
      <motion.div
        layout
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="gradient-border cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="glass-card-glow rounded-2xl p-6 h-full relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#010268]/8 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative">
            <div className="flex gap-3 mb-4 overflow-x-auto">
              {program.images.map((_, j) => (
                <div
                  key={j}
                  className="w-24 h-18 rounded-lg bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] flex items-center justify-center shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow"
                >
                  <Mountain className="text-[#111827] group-hover:scale-110 transition-transform duration-500" size={18} />
                </div>
              ))}
            </div>
            <h3 className="text-[#111827] font-bold text-lg mb-2 group-hover:text-[#111827] transition-colors">{program.name}</h3>
            <p className={`text-[#111827] text-sm leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
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
                  <div className="border-t border-white/[0.06] pt-4 mt-4">
                    <p className="text-[#111827] text-xs leading-relaxed">
                      This program is part of AMI&apos;s commitment to community engagement and professional development in the IT industry across Indonesia.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="mt-3 text-[#111827] text-xs flex items-center gap-1 hover:text-[#111827] transition-colors"
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
      <div className="absolute inset-0 bg-[#ffffff]" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-14">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block mb-2 tracking-tight">
              {data.title}
            </h2>
            <p className="text-[#111827] text-sm">{data.subtitle}</p>
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

