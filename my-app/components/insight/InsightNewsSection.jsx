'use client';
import { useState } from 'react';
import Image from 'next/image';
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
        <div className="relative flex min-h-[240px] flex-col overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0a0b85_0%,#0f1aa8_45%,#111827_100%)] p-6 sm:p-7">
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex flex-1 flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="glass-card items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-[#010268] text-white text-[10px] font-semibold tracking-wider uppercase">
                {item.category}
              </span>
              {item.date && (
                <span className="flex items-center gap-1 text-white text-[10px]">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-[#e8eaeb] font-semibold text-base group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <Newspaper size={16} className="text-[#e8eaeb] group-hover:text-white transition-colors flex-shrink-0 mt-1" />
            </div>

            <p className="text-white text-sm leading-relaxed line-clamp-2">
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
                  <div className="mt-4">
                    {item.content && (
                      <p className="text-white text-sm leading-relaxed">
                        {item.content}
                      </p>
                    )}
                    {item.source && (
                      <span className="mt-4 flex items-center gap-1.5 text-white text-xs">
                        <ExternalLink className="w-3 h-3" />
                        Source: {item.source}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="mt-3 text-[#e8eaeb] text-xs flex items-center gap-1 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            >
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3" />
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
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const itemsPerPage = 6;
  const categoriesPerPage = 10;
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
  const totalCategoryPages = Math.max(1, Math.ceil(categories.length / categoriesPerPage));
  const paginatedCategories = categories.slice(
    (categoryPage - 1) * categoriesPerPage,
    categoryPage * categoriesPerPage,
  );

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category === activeCategory);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[920px] overflow-hidden sm:h-[840px] lg:h-[1200px]">
        <Image
          src="/decor/Insight_news.svg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="pointer-events-none h-full w-full object-cover opacity-100 mix-blend-multiply"
          priority
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/6 via-[#fafbfc]/8 to-[#f6f7fa]/12" />
      <div className="absolute inset-0 z-10 grid-pattern opacity-[0.02]" />
      <div className="absolute bottom-0 right-0 z-10 h-96 w-96 rounded-full bg-cyan-900/5 blur-[120px]" />

      <div className="relative z-20 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-20">
        <AnimatedSection>
          <div className="mb-14 text-left">
            <div className="mb-1">
              <h2 className="text-[35px] uppercase sm:text-[50px] font-black gradient-text inline-block">
                {data.title}
              </h2>
            </div>
            <p className="text-[#111827]/65 font-semibold sm:text-[18px]">{data.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="mb-8 flex flex-wrap items-center justify-left gap-2">
          {paginatedCategories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
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

        {categories.length > categoriesPerPage && (
          <div className="ml-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCategoryPage((page) => Math.max(1, page - 1))}
              disabled={categoryPage === 1}
              className="rounded-full border border-[#010268]/10 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#010268] transition-colors hover:bg-[#f3f5ff] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>

            <button
              type="button"
              onClick={() => setCategoryPage((page) => Math.min(totalCategoryPages, page + 1))}
              disabled={categoryPage === totalCategoryPages}
              className="rounded-full border border-[#010268]/10 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#010268] transition-colors hover:bg-[#f3f5ff] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
        </div>

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          {paginatedItems.map((item, i) => (
            <NewsCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        {filteredItems.length > itemsPerPage && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
