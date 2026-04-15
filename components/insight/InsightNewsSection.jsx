'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ChevronDown, Calendar, ExternalLink } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function NewsCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedSection delay={index * 0.08}>
      <motion.article
        layout
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="gradient-border group cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="glass-card rounded-2xl p-6 sm:p-7 h-full relative overflow-hidden">
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#010268] border border-[#010268] text-white text-[10px] font-semibold tracking-wider uppercase">
                {item.category}
              </span>
              {item.date && (
                <span className="flex items-center gap-1 text-[#111827] text-[10px]">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-[#111827] font-semibold text-base group-hover:text-[#111827] transition-colors">
                {item.title}
              </h3>
              <Newspaper size={16} className="text-[#d1d5db] group-hover:text-[#010268] transition-colors flex-shrink-0 mt-1" />
            </div>

            <p className={`text-[#111827] text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
              {item.excerpt}
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
                  <div className="border-t border-white/[0.06] pt-3 mt-3">
                    {item.source && (
                      <span className="flex items-center gap-1.5 text-[#111827] text-xs">
                        <ExternalLink className="w-3 h-3" />
                        Source: {item.source}
                      </span>
                    )}
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
              {expanded ? 'Show less' : 'Read more'}
            </button>
          </div>
        </div>
      </motion.article>
    </AnimatedSection>
  );
}

export default function InsightNewsSection({ data }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />
      <div className="absolute inset-0 grid-pattern opacity-8" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-14">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Stay Updated
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block mb-2">
              {data.title}
            </h2>
            <p className="text-[#111827] text-sm">{data.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.items.map((item, i) => (
            <NewsCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

