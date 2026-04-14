'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ChevronDown, Search, X } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function BrandCard({ brand, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
      <AnimatedSection delay={index * 0.08}>
      <motion.div
        layout
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="gradient-border group cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="glass-card  bg-black/30 rounded-2xl p-6 relative overflow-hidden h-full">
          {/* Subtle glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#010268]/8 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative">
            {/* Logo */}
            <div className="bg-[#f3f4f6] rounded-xl p-4 mb-5 flex items-center justify-center h-16 group-hover:shadow-lg group-hover:shadow-gray-300/30 transition-shadow duration-300">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={140}
                height={48}
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* Brand name + description */}
            <h3 className="text-base font-bold text-[#111827] mb-2 group-hover:text-[#111827] transition-colors">
              {brand.name}
            </h3>
            <p className="text-[#111827] text-xs leading-relaxed mb-4">
              {brand.description}
            </p>

            {/* Solutions list */}
            <div className="mb-4">
              <span className="text-[10px] text-[#111827] uppercase tracking-wider font-semibold block mb-2">Solutions</span>
              <div className="flex flex-wrap gap-1.5">
                {brand.solutions.map((sol, i) => (
                  <Link
                    key={i}
                    href={`/solution/${sol.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#010268] border border-[#010268] text-white hover:bg-[#1a1b78] hover:border-[#1a1b78] hover:text-white transition-all duration-200"
                  >
                    {sol.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Expandable extra content */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/[0.06] pt-4 mb-3">
                    <p className="text-[#111827] text-xs leading-relaxed mb-3">
                      As an authorized {brand.name} partner, AMI provides certified expertise, priority support, and seamless deployment of {brand.name} solutions tailored to your enterprise needs.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
              <button
                className="text-[#111827] text-xs flex items-center gap-1 hover:text-[#111827] transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              >
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
                {expanded ? 'Less' : 'Details'}
              </button>
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#010268] hover:text-[#111827] transition-colors group/link"
              >
                Visit Website
                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function BrandGrid({ brands }) {
  const [query, setQuery] = useState('');

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return brands;

    return brands.filter((brand) => {
      const searchableText = [
        brand.name,
        brand.description,
        ...(brand.solutions || []).map((solution) => solution.name),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [brands, query]);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[#ffffff]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-15" />
      <div className="absolute inset-0 dot-pattern opacity-15" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Our Partners
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block mb-3">
              World-Class Technology Brands
            </h2>
            <p className="text-[#111827] text-sm max-w-2xl mx-auto">
              Each brand card shows the solutions they power. Click to expand details, or visit their website directly.
            </p>
          </div>
        </AnimatedSection>

        <div className="mb-6 max-w-2xl mx-auto">
          <label className="relative block">
            <span className="sr-only">Search principals or solutions</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search principal or solution..."
              className="w-full rounded-full border border-slate-200 bg-white/90 py-3 pl-11 pr-12 text-sm text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.06)] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#0a0b85]/35 focus:ring-4 focus:ring-[#0a0b85]/10"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>{filteredBrands.length} principal(s) found</span>
            <span>Search by principal name or solution name</span>
          </div>
        </div>

        <div className="brand-grid-scrollbar max-h-[72vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBrands.length ? (
              filteredBrands.map((brand, i) => (
                <BrandCard key={brand.slug} brand={brand} index={i} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center text-sm text-slate-500">
                No principals match your search. Try another name or solution.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

