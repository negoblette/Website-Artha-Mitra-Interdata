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
        className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg shadow-gray-300/20 hover:shadow-xl hover:shadow-gray-300/30 transition-shadow"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-full h-44 bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] flex items-center justify-center overflow-hidden">
          <Mountain className="text-[#111827] group-hover:scale-110 transition-transform duration-500" size={32} />
        </div>

        <div className="bg-[#f3f4f6] p-4">
          <span className="text-[#010268] text-xs font-semibold tracking-widest uppercase">
            {event.category}
          </span>
          <h4 className="text-[#111827] font-bold text-sm mt-1 mb-2 group-hover:text-purple-700 transition-colors">
            {event.name}
          </h4>
          <p className={`text-gray-500 text-xs leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
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
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Part of AMI&apos;s ongoing commitment to knowledge sharing and industry engagement.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="mt-2 text-[#010268] text-[11px] flex items-center gap-1 hover:text-[#010268] transition-colors"
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-14">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Events
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block mb-2 tracking-tight">
              {data.title}
            </h2>
            <p className="text-[#111827] text-sm">{data.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((event, i) => (
            <EventCard key={i} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

