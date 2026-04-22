'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, Tag, User, Calendar } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import Image from 'next/image';

function ArticleCard({ item, index, expanded, onToggle }) {
  const hasImage = typeof item.image === 'string' && item.image.trim().length > 0;

  return (
      <AnimatedSection delay={index * 0.08}>
      <motion.article
        layout
        className="group w-full self-start text-left [perspective:1600px]"
      >
        <div className="relative flex min-h-[520px] flex-col overflow-hidden rounded-[1.85rem] border border-white/65 bg-[linear-gradient(135deg,#0a0b85_0%,#0f1aa8_45%,#111827_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-[0_24px_70px_rgba(10,11,133,0.18)]">
          <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-white">
            {hasImage ? (
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-[1.45rem] border border-white/75 bg-white/90 shadow-[0_18px_40px_rgba(10,11,133,0.14)] ring-1 ring-[#0a0b85]/5">
                <BookOpen className="text-[#0a0b85] transition-transform duration-500 group-hover:scale-110" size={30} />
              </div>
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(10,11,133,0.10),transparent_28%),linear-gradient(135deg,rgba(10,11,133,0.06),transparent_58%)]" />
            <div className="absolute left-5 top-5 rounded-full border border-white/75 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0a0b85] shadow-[0_10px_20px_rgba(10,11,133,0.08)] backdrop-blur-sm">
              Article
            </div>
            {item.date && (
              <div className="absolute right-5 top-5 rounded-full border border-white/75 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0a0b85] shadow-[0_10px_20px_rgba(10,11,133,0.08)] backdrop-blur-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}
            <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#0a0b85]/10 blur-3xl" />
            <div className="absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-white/40 blur-2xl" />
          </div>

          <div className="relative flex flex-1 flex-col p-5 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(10,11,133,0.22),transparent)]" />
            <span className="inline-flex w-fit rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0a0b85] shadow-[0_8px_18px_rgba(10,11,133,0.06)]">
              {item.category}
            </span>

            <h3 className="mt-3 line-clamp-2 text-[1.02rem] font-bold tracking-tight text-white transition-colors group-hover:text-white">
              {item.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-7 text-white">
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
                  <div className="mt-4 border-t border-[#0a0b85]/10 pt-4">
                    <p className="text-sm leading-7 text-white">
                      {item.content}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-white">
                      {item.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-white" /> {item.author}
                        </span>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3 text-white" />
                          {item.tags.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto pt-6">
              <button
                className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                type="button"
              >
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
                {expanded ? 'Show less' : 'Read more'}
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </AnimatedSection>
  );
}

function FeaturedArticle({ item }) {
  const hasImage = typeof item.image === 'string' && item.image.trim().length > 0;

  return (
    <AnimatedSection>
      <motion.article
        layout
        className="group mx-auto grid max-w-5xl gap-8 rounded-[2rem] border border-[#e7ebff] bg-white p-4 shadow-[0_28px_80px_rgba(10,11,133,0.08)] sm:p-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
      >
        <div className="relative min-h-[280px] overflow-hidden rounded-[1.7rem] bg-[linear-gradient(135deg,#eef2ff_0%,#dfe8ff_50%,#f8fbff_100%)] sm:min-h-[340px]">
          {hasImage ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_20px_50px_rgba(10,11,133,0.12)] backdrop-blur-sm">
                <BookOpen className="h-14 w-14 text-[#0a0b85] transition-transform duration-500 group-hover:scale-110" />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(10,11,133,0.12),transparent_30%),linear-gradient(135deg,rgba(10,11,133,0.06),transparent_58%)]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/75 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0a0b85] shadow-[0_10px_20px_rgba(10,11,133,0.08)] backdrop-blur-sm">
            Featured Article
          </div>
          {item.date && (
            <div className="absolute bottom-5 left-5 rounded-full border border-white/75 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0a0b85] shadow-[0_10px_20px_rgba(10,11,133,0.08)] backdrop-blur-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center px-1 py-2 sm:px-2 lg:pr-6">
          <span className="inline-flex w-fit rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0a0b85] shadow-[0_8px_18px_rgba(10,11,133,0.06)]">
            {item.category}
          </span>

          <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#111827] transition-colors group-hover:text-[#0a0b85] sm:text-3xl lg:text-[2.15rem] lg:leading-tight">
            {item.title}
          </h3>

          <p className="mt-4 text-sm leading-7 text-[#526076] sm:text-[15px]">
            {item.excerpt}
          </p>

          <div className="mt-5 border-t border-[#0a0b85]/10 pt-5">
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#526076]">
              {item.author && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-[#0a0b85]" /> {item.author}
                </span>
              )}
              {item.tags && item.tags.length > 0 && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3 text-[#0a0b85]" />
                  {item.tags.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </AnimatedSection>
  );
}

export default function ArticlesSection({ data }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const itemsPerPage = 3;
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
  const headlineItem = data?.headline;

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
    setExpandedArticle(null);
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-[0.08]" />
      <div className="absolute inset-0 dot-pattern opacity-15" />
      <div
        className="pointer-events-none absolute inset-x-0 inset-y-0 z-0 overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.12) 8%, black 22%, black 74%, rgba(0,0,0,0.18) 90%, transparent 100%)',
          WebkitMaskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.12) 8%, black 22%, black 74%, rgba(0,0,0,0.18) 90%, transparent 100%)',
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-x-[-12%] inset-y-0 bg-[url('/decor/grid.svg')] bg-[length:1220px_auto] bg-repeat-x bg-top opacity-60 [filter:invert(7%)_sepia(100%)_saturate(3600%)_hue-rotate(200deg)_brightness(0.42)_contrast(1.2)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.72)_10%,rgba(255,255,255,0)_20%,rgba(255,255,255,0)_78%,rgba(255,255,255,0.78)_91%,rgba(255,255,255,0.99)_100%)]" />
      </div>
      <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[#737373]/10 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-8 sm:mb-10 text-center">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-1">
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

        <div className="relative z-10 mb-8 flex flex-wrap justify-center gap-2">
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

        {headlineItem && <FeaturedArticle item={headlineItem} />}

        <div className="mx-auto mt-8 grid max-w-5xl items-start grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedItems.map((item, i) => (
            <ArticleCard
              key={item.slug}
              item={item}
              index={i}
              expanded={expandedArticle === item.slug}
              onToggle={() =>
                setExpandedArticle((current) => (current === item.slug ? null : item.slug))
              }
            />
          ))}
        </div>

        {filteredItems.length > itemsPerPage && (
          <div className="mx-auto mt-10 flex max-w-5xl items-center justify-center gap-3">
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
