'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, ChevronDown } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function BrandCard({ brand, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedSection delay={index * 0.08}>
      <motion.div
        layout
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="rounded-2xl p-6 relative overflow-hidden h-full bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] border border-white/10 group-hover:border-white/25 transition-all duration-500 group-hover:shadow-[0_8px_32px_rgba(0,0,80,0.4),0_0_0_1px_rgba(255,255,255,0.08)]">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative">
            <div className="bg-white rounded-xl rounded-b-none -mx-6 -mt-6 mb-5 flex items-center justify-center h-24 overflow-hidden">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={160}
                height={56}
                className="h-[80px] w-auto object-contain"
              />
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              {brand.name}
            </h3>
            <p className="text-white/80 text-xs font-semibold leading-relaxed mb-4">
              {brand.description}
            </p>

            <div className="mb-4">
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
                  <div className="border-t border-white/10 pt-4 mb-3">
                    <p className="text-white/80 text-xs leading-relaxed mb-3">
                      As an authorized {brand.name} partner, AMI provides certified expertise, priority support, and seamless deployment of {brand.name} solutions tailored to your enterprise needs.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button className="text-white/80 text-xs flex items-center gap-1 hover:text-white transition-colors">
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
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors group/link"
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
  return (
    <section className="relative py-24 pb-8 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Our Partners
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text inline-block mb-3 text-[rgb(19,27,94)]">
              World-Class Technology Brands
            </h2>
            <p className="text-[#111827] text-sm max-w-2xl font-semibold mx-auto">
              Each brand card shows the solutions they power. Click to expand details, or visit their website directly.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {brands.map((brand, i) => (
            <BrandCard key={brand.slug} brand={brand} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}