'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function SolutionCard({ solution, index }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = LucideIcons[solution.icon] || LucideIcons.Layers;

  return (
    <AnimatedSection delay={index * 0.08}>
      <motion.div
        layout
        className="group cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-2xl p-5 sm:p-6 relative overflow-hidden bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] border border-white/10 group-hover:border-white/25 transition-all duration-500 group-hover:shadow-[0_8px_32px_rgba(0,0,80,0.4),0_0_0_1px_rgba(255,255,255,0.08)]">

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </div>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative">
            <div className="flex items-start gap-3.5 mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  {solution.name}
                </h3>
                <p className="text-white/80 text-[13px] font-semibold sm:text-sm leading-relaxed">
                  {solution.shortDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
              <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Partners:</span>
              {solution.brands.map((brand, i) => (
              <Link
                key={i}
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 border border-white/20 rounded-xl px-3 hover:bg-white/15 hover:scale-105 transition-all duration-200"                title={`Visit ${brand.name}`}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={80}
                  height={28}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              </Link>
              ))}
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 pt-4 mt-2">
                    <p className="text-white/80 text-sm font-semibold leading-relaxed mb-4">
                      {solution.fullDescription}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {solution.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                          <span className="text-white/80 font-semibold text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                className="text-white/60 text-xs flex items-center gap-1 font-semibold hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              >
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <LucideIcons.ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
                {expanded ? 'Less' : 'More details'}
              </button>
              <Link
                href={`/solution/${solution.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors group/link"
              >
                Learn More
                <LucideIcons.ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function SolutionGrid({ solutions }) {
  return (
    <section className="relative py-20 overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[rgb(13,27,94)] tracking-tight mb-3">
              Our Solutions
            </h2>
            <p className="text-[#111827] text-[13px] font-semibold sm:text-sm max-w-2xl mx-auto">
              Click any card to explore details, or hit &quot;Learn More&quot; for the full solution page.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {solutions.map((solution, i) => (
            <SolutionCard key={solution.slug} solution={solution} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
