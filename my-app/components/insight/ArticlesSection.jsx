'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, Tag, User, Calendar } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import Image from 'next/image';
function ArticleCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedSection delay={index * 0.08}>
      <motion.article
        layout
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="gradient-border group h-full cursor-pointer rounded-2xl transition-all duration-300 hover:shadow-[0_24px_54px_rgba(10,11,133,0.26)]"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className={`relative flex flex-col overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0a0b85_0%,#0f1aa8_45%,#111827_100%)] p-7 sm:p-8 ${
            expanded ? 'h-auto' : 'h-[200px] sm:h-[250px]'
          }`}
        >
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white text-[10px] font-semibold tracking-[0.2em] uppercase">
                {item.category}
              </span>
              {item.date && (
                <span className="flex items-center gap-1 text-white text-[10px]">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-white font-bold text-lg group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <BookOpen size={18} className="text-white group-hover:text-[#010268] transition-colors flex-shrink-0 mt-1" />
            </div>

            <p className={`text-white text-sm leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
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
                    <p className="text-white text-sm leading-relaxed mb-4">
                      {item.content}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-white">
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
              className="mt-auto pt-3 text-white text-xs flex items-center gap-1 hover:text-[#111827] transition-colors"
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
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const items = Array.from(
    new Map(
      (data?.items ?? [])
        .filter((item) => item?.slug)
        .map((item) => [
          item.slug,
          {
            ...item,
            category: typeof item.category === 'string' ? item.category.trim() : item.category,
          },
        ]),
    ).values(),
  );
  const categories = ['All', ...new Set(items.map((item) => item.category).filter(Boolean))];

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-[0.08]" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div
        className="pointer-events-none absolute -inset-28 z-0"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)',
          WebkitMaskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 20%, black 75%, transparent 100%)',
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
        }}
      >
        <Image
          src="/decor/grid.svg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="scale-[1.45] object-cover object-center opacity-60 [filter:invert(7%)_sepia(100%)_saturate(3600%)_hue-rotate(200deg)_brightness(0.42)_contrast(1.2)]"
        />
      </div>
      <div className="absolute left-[-8%] top-16 h-64 w-64 rounded-full bg-blue-300/100 blur-3xl" />
      <div className="absolute bottom-[9rem] right-[-3rem] h-80 w-80 rounded-full bg-indigo-200/100 blur-3xl" />
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#737373]/10 blur-[120px]" />
      {/* <div className="pointer-events-none absolute left-[44.5rem] top-[-1.75rem] z-10 h-[320px] w-[320px] opacity-100">
        <Image
          src="/decor/dots.svg"
          alt=""
          fill
          sizes="56px"
          priority
          className="object-contain"
        />
      </div> */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-8 sm:mb-10 text-center">
            <span className="inline-block  text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-1">
              Expert Insights
            </span>
            <div className="mb-1">
              <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block">
                {data.title}
              </h2>
            </div>
            <p className="text-[#111827] text-sm">{data.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? 'border-[#010268] bg-[#010268] text-white'
                    : 'border-[#010268]/10 bg-white text-[#010268] hover:bg-[#f3f5ff]'
                }`}
                aria-pressed={isActive}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {paginatedItems.map((item, i) => (
            <ArticleCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        {filteredItems.length > itemsPerPage && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-[#010268]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#010268] transition-colors hover:bg-[#f3f5ff] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-full px-3 text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#010268] text-white'
                        : 'border border-[#010268]/10 bg-white text-[#010268] hover:bg-[#f3f5ff]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-[#010268]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#010268] transition-colors hover:bg-[#f3f5ff] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

