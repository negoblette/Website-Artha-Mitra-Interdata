'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, Tag, User, Calendar } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function ArticleCard({ item, index }) {
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
        <div className="glass-card rounded-2xl p-7 sm:p-8 h-full relative overflow-hidden">
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[#111827] text-[10px] font-semibold tracking-[0.2em] uppercase">
                {item.category}
              </span>
              {item.date && (
                <span className="flex items-center gap-1 text-[#111827] text-[10px]">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-[#111827] font-bold text-lg group-hover:text-[#111827] transition-colors">
                {item.title}
              </h3>
              <BookOpen size={18} className="text-[#111827] group-hover:text-[#010268] transition-colors flex-shrink-0 mt-1" />
            </div>

            <p className={`text-[#111827] text-sm leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
              {item.excerpt}
            </p>

            <AnimatePresence>
              {expanded && item.content && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/[0.06] pt-4 mt-4">
                    <p className="text-[#111827] text-sm leading-relaxed mb-4">
                      {item.content}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-[#111827]">
                      {item.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {item.author}
                        </span>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {item.tags.join(', ')}
                        </span>
                      )}
                    </div>
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

export default function ArticlesSection({ data }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#ffffff]" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#737373]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-14">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Expert Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block mb-2">
              {data.title}
            </h2>
            <p className="text-[#111827] text-sm">{data.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.items.map((item, i) => (
            <ArticleCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

