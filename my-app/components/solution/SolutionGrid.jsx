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
        className="group cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-5 transition-all duration-500 group-hover:border-white/25 group-hover:shadow-[0_8px_32px_rgba(0,0,80,0.4),0_0_0_1px_rgba(255,255,255,0.08)] sm:min-h-[300px] sm:p-6">

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </div>
    
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative flex flex-col">
            <div className="flex items-start gap-3.5 mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[20px] font-bold text-white mb-1">
                  {solution.name}
                </h3>
                <p className="text-white/80 text-[17px] text-justify font-base leading-relaxed">
                  {solution.shortDescription}
                </p>
              </div>
            </div>

            <div className="mb-3.5 min-h-[72px]">
              <span className="text-[13px] text-white/60 uppercase tracking-wider font-bold">Partners:</span>
              <div className="mt-2 flex flex-wrap items-center gap-2.5 content-start">
                {solution.brands
                  .slice(0, solution.brands.length > 4 ? 3 : 4)
                  .map((brand, i) => {
                  return (
                    <Link
                      key={i}
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-11 w-[96px] items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 transition-all duration-200 hover:scale-105 hover:bg-white/15"
                      title={`Visit ${brand.name}`}
                    >
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={80}
                        height={28}
                        className="h-6 w-auto max-w-full object-contain brightness-0 invert"
                      />
                    </Link>
                  );
                })}
                {solution.brands.length > 4 ? (
                  <span className="inline-flex h-11 w-[96px] items-center justify-center rounded-xl border border-white/14 bg-white/6 px-3 text-[12px] font-semibold text-white/70">
                    +{solution.brands.length - 3} more
                  </span>
                ) : null}
              </div>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -8 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="mb-3 rounded-2xl text-justify bg-white/20 px-5 py-5 shadow-[0_40px_80px_rgba(3,6,53,0.52)] backdrop-blur-xl">
                    <p className="mb-4 text-[17px] leading-relaxed text-white/80">
                      {solution.fullDescription}
                    </p>
                    <div className="mb-4">
                      <span className="text-[13px] font-bold uppercase tracking-wider text-white/60">
                        Partners
                      </span>
                      <div className="mt-2 flex flex-wrap items-center gap-2.5">
                        {solution.brands.map((brand, i) => (
                          <Link
                            key={`${brand.name}-${i}`}
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-11 w-[96px] items-center justify-center rounded-xl border border-white/20 bg-white/10 px-3 transition-all duration-200 hover:scale-105 hover:bg-white/15"
                            title={`Visit ${brand.name}`}
                          >
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={80}
                              height={28}
                              className="h-6 w-auto max-w-full object-contain brightness-0 invert"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {solution.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
                          <span className="text-[17px] text-white/80">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-2">
              <button
                className="text-white/60 text-[15px] flex items-center gap-1 font-semibold hover:text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              >
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <LucideIcons.ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
                {expanded ? 'Less' : 'Details'}
              </button>
              <Link
                href={`/solution/${solution.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-white/80 hover:text-white transition-colors group/link"
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/reference/solution-page-solutiongrid.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100%',
          backgroundPosition: 'center top',
        }}
      />
      <div className="absolute inset-0" />
      
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(238,243,255,1)_0%,rgba(238,243,255,0.76)_14%,rgba(238,243,255,0)_28%,rgba(238,243,255,0)_100%)]" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-14">
            <h2 className="mt-5 text-4xl font-black tracking-tight text-[rgb(13,27,94)] sm:text-5xl">
              Solutions
            </h2>
            <p className="text-[#111827] text-[13px] font-base sm:text-lg max-w-2xl mx-auto">
              Click any card to explore details, or hit &quot;Learn More&quot; for the full solution page.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
          {solutions.map((solution, i) => (
            <SolutionCard key={solution.slug} solution={solution} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
