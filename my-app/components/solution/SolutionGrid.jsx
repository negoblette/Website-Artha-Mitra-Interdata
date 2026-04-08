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
        className="gradient-border group cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div className="glass-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          {/* Glow effect on hover */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#010268]/8 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative">
            {/* Icon + Title */}
            <div className="flex items-start gap-3.5 mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#010268]/14 to-[#737373]/8 border border-[#010268]/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-[#010268]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#111827] mb-1 group-hover:text-[#111827] transition-colors">
                  {solution.name}
                </h3>
                <p className="text-[#111827] text-[13px] sm:text-sm leading-relaxed">
                  {solution.shortDescription}
                </p>
              </div>
            </div>

            {/* Brand logos row */}
            <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
              <span className="text-[10px] text-[#111827] uppercase tracking-wider font-semibold">Partners:</span>
              {solution.brands.map((brand, i) => (
                <a
                  key={i}
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#f3f4f6]/90 rounded-lg px-3 py-1.5 hover:bg-[#5f5f5f] hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-gray-300/30"
                  title={`Visit ${brand.name}`}
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={80}
                    height={28}
                    className="h-5 w-auto object-contain"
                  />
                </a>
              ))}
            </div>

            {/* Expandable details */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/[0.06] pt-4 mt-2">
                    <p className="text-[#111827] text-sm leading-relaxed mb-4">
                      {solution.fullDescription}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {solution.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#010268] to-[#737373] flex-shrink-0" />
                          <span className="text-[#111827] text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer: expand toggle + Learn More */}
            <div className="flex items-center justify-between pt-2">
              <button
                className="text-[#111827] text-xs flex items-center gap-1 hover:text-[#111827] transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              >
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <LucideIcons.ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
                {expanded ? 'Less' : 'More details'}
              </button>
              <Link
                href={`/solution/${solution.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#010268] hover:text-[#010268] transition-colors group/link"
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
          <div className="text-center mb-10">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              What We Offer
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text inline-block mb-2.5">
              Our Solutions
            </h2>
            <p className="text-[#111827] text-[13px] sm:text-sm max-w-2xl mx-auto">
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

