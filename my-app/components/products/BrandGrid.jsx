'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ChevronDown, Search, X } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const FILTER_CHIPS = [  
  'Network Infrastructure',
  'IT Security',
  'Network Monitoring',
  'Secure Access & VPN',
];

function BrandCard({ brand, index }) {
  const [expanded, setExpanded] = useState(false);
  const hasLogo = Boolean(brand.logo);

  return (
    <AnimatedSection delay={index * 0.08}>
      <motion.div
        layout
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group  cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-6 transition-all duration-500 group-hover:border-white/25 group-hover:shadow-[0_8px_32px_rgba(0,0,80,0.4),0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative flex h-full flex-col">
            <div className="bg-white rounded-xl rounded-b-none -mx-6 -mt-6 mb-5 flex h-24 items-center justify-center overflow-hidden px-5 py-3">
              {hasLogo ? (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={160}
                  height={56}
                  className="max-h-[54px] w-auto max-w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-6 text-center">
                  <span className="text-sm font-bold uppercase tracking-[0.22em] text-[#0a0b85]/75">
                    {brand.name}
                  </span>
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {brand.name}
            </h3>
            <p
              className="mb-4 text-xs font-semibold leading-relaxed text-white/80"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {brand.description}
            </p>

            <div className="mb-4 min-h-[96px]">
              <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold block mb-2">Solutions</span>
              <div className="flex flex-wrap gap-1.5 min-h-[60px] content-start">
                {brand.solutions.map((sol, i) => (
                  <Link
                    key={i}
                    href={`/solution/${sol.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full bg-white/8 border border-white/15 text-white/90 hover:bg-white/15 hover:border-white/30 transition-all duration-200 font-medium"                  >
                    {sol.name}
                  </Link>
                ))}
              </div>
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}

                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white/20 rounded-2xl shadow-[0_40px_80px_rgba(3,6,53,0.52)] backdrop-blur-xl py-5 px-5 mb-3">
                    <p className="text-white/80 text-xs leading-relaxed mb-3">
                      As an authorized {brand.name} partner, AMI provides certified expertise, priority support, and seamless deployment of {brand.name} solutions tailored to your enterprise needs.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-2">
              <button className="text-white/80 text-xs flex items-center gap-1 hover:text-white transition-colors">
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
                {expanded ? 'Less' : 'Details'}
              </button>
              
              {brand.website ? (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors group/link"
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/45">
                  Logo pending
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function BrandGrid({ brands }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.toLowerCase().trim();

  const filteredBrands = brands.filter((brand) => {
    const haystack = [
      brand.name,
      brand.description,
      ...(brand.solutions || []).map((solution) => solution.name),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return (
    <section className="relative py-24 pb-24 overflow-visible">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5f8ff]/75 to-transparent" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-[0.04]" />
<<<<<<< HEAD
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
=======
      <div className="relative z-10 mx-auto w-full max-w-[1750px] px-4 sm:px-6 lg:px-40">
>>>>>>> devandra-dev
        <AnimatedSection>
          <div className="text-center mb-14">
            <h2 className="mt-5 text-4xl font-black tracking-tight text-[rgb(13,27,94)] sm:text-5xl">
              World-Class Technology Brands
            </h2>
          </div>
        </AnimatedSection>

        <div className="relative overflow-hidden rounded-[2rem] border border-[#dbe4ff]/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(240,245,255,0.92))] p-4 shadow-[0_24px_70px_rgba(10,11,133,0.08)] backdrop-blur-xl sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.78),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(135,175,255,0.14),transparent_34%)]" />
          <div className="absolute -top-16 right-[-3rem] h-48 w-48 rounded-full bg-[#9bb6ff]/18 blur-3xl" />
          <div className="absolute -bottom-12 left-[-2rem] h-44 w-44 rounded-full bg-[#cfd9ff]/30 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex flex-col gap-4 border-b border-[#d8e2ff]/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgb(13,27,94)]/55">
                  Partner Catalog
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-[rgb(13,27,94)] sm:text-2xl">
                  Explore Solutions by Principal
                </h3>
                <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[#111827]/72">
                  Browse our technology partners by brand, capability, or solution area.
                </p>
              </div>

              <div className="rounded-2xl border border-[#d6e0ff] bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(13,27,94)]/50">
                  Showing
                </p>
                <p className="mt-1 text-base font-bold text-[rgb(13,27,94)]">
                  {filteredBrands.length}
                  <span className="ml-1 text-sm font-medium text-[#111827]/55">
                    of {brands.length} partners
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="sr-only" htmlFor="brand-search">
                Search brands
              </label>
              <div className="flex items-center gap-3 rounded-[1.6rem] border border-[#cfd9ff]/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(237,243,255,0.88))] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-shadow duration-300 focus-within:shadow-[0_0_0_4px_rgba(10,11,133,0.08)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0a0b85]/8 text-[#0a0b85]">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  id="brand-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by brand, capability, or solution"
                  className="w-full bg-transparent text-sm font-semibold text-[rgb(13,27,94)] outline-none placeholder:text-[rgb(13,27,94)]/38"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[rgb(13,27,94)]/55 transition-colors hover:bg-[#0a0b85]/6 hover:text-[rgb(13,27,94)]"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {FILTER_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setQuery((current) => (current === chip ? '' : chip))}
                    className={`rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-200 ${
                      query === chip
                        ? 'border-[#0a0b85]/20 bg-[#0a0b85] text-white shadow-[0_10px_24px_rgba(10,11,133,0.2)]'
                        : 'border-[#d8e0ff] bg-white/70 text-[#0a0b85]/72 hover:border-[#0a0b85]/18 hover:bg-[#eef3ff]'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#d8e2ff]/80 bg-white/42 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              <div className="max-h-[68vh] overflow-y-auto px-1 pb-3 pt-3 brand-grid-scrollbar">
                {filteredBrands.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {filteredBrands.map((brand, i) => (
                      <BrandCard key={brand.slug} brand={brand} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#cdd4ea] bg-white/70 px-6 py-16 text-center">
                    <p className="text-base font-bold text-[rgb(13,27,94)]">No brands found</p>
                    <p className="mt-2 text-sm font-medium text-[#111827]/70">
                      Try another keyword or clear the search to see all brand cards.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
