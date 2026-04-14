'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, ChevronDown } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function EventCard({ event, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedSection delay={index * 0.1}>
      <motion.div
        layout
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-shadow hover:shadow-[0_28px_70px_rgba(10,11,133,0.16)]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#edf3ff_0%,#dce6ff_52%,#f6f9ff_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_0%),linear-gradient(135deg,rgba(10,11,133,0.08),transparent_58%)]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0a0b85]">
            Event
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-white/70 bg-white/85 shadow-lg shadow-[#0a0b85]/10">
            <Mountain className="text-[#0a0b85] group-hover:scale-110 transition-transform duration-500" size={30} />
          </div>
        </div>

        <div className="relative flex min-h-[260px] flex-col p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(10,11,133,0.2),transparent)]" />
          <span className="inline-flex rounded-full border border-[#0a0b85]/10 bg-[#eef3ff]\ px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0a0b85]">
            {event.category}
          </span>
          <h4 className="mt-3 text-base font-bold text-[#111827] transition-colors group-hover:text-[#0a0b85]">
            {event.name}
          </h4>
          <p className={`mt-2 text-sm leading-7 text-[#475569] ${expanded ? '' : 'line-clamp-3'}`}>
            {event.description}
          </p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-2xl border border-[#0a0b85]/8 bg-[#f8fbff] p-4">
                  <p className="text-[12px] leading-6 text-[#64748b]">
                    Part of AMI&apos;s ongoing commitment to knowledge sharing and industry engagement.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="mt-auto inline-flex items-center gap-2 rounded-full border border-[#0a0b85]/10 bg-[#f3f6ff] px-3 py-1.5 text-[11px] font-semibold text-[#0a0b85] transition-colors hover:bg-[#e8eeff]"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3 h-3" />
            </motion.span>
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function EventsSection({ data }) {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-14 max-w-2xl">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Events
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block mb-2 tracking-tight">
              {data.title}
            </h2>
            <p className="text-[#475569] text-sm leading-7">{data.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((event, i) => (
            <EventCard key={i} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

