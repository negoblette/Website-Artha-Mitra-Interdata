'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

function SolutionColumn({ solutions }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="h-full min-h-0 flex flex-col px-4 sm:px-6 md:px-7 py-4 sm:py-5 md:py-6 border-b md:border-b-0 md:border-r border-[#dbdbdb]">
      <div className="sticky top-0 z-10 bg-white/92 backdrop-blur-sm pb-2 md:pb-3">
        <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-black uppercase">Solutions</p>
        <h3 className="mt-1.5 text-3xl sm:text-4xl md:text-5xl font-extrabold text-black">Infrastructure</h3>
      </div>

      <div className="no-scrollbar mt-1.5 space-y-2.5 md:space-y-3.5 overflow-y-auto pr-1 flex-1 min-h-0 max-h-96 md:max-h-none">
        {solutions.map((solution, i) => {
          const Icon = LucideIcons[solution.icon] || LucideIcons.Layers;
          const isExpanded = expandedIndex === i;

          return (
            <div key={`${solution.slug}-${i}`}>
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full text-left flex items-start gap-2.5 font-bold text-black leading-tight hover:text-[#0a0b85] transition-colors group"
              >
                <Icon size={19} className="mt-1 text-[#007f99] group-hover:text-[#0a0b85] flex-shrink-0" />
                <span className="text-[18px] sm:text-[21px] flex-1">{solution.name}</span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 mt-1"
                >
                  <LucideIcons.ChevronDown size={18} />
                </motion.div>
              </button>
              <p className="ml-7 text-[12px] sm:text-[14px] text-black mt-0.5 leading-snug">{solution.shortDescription}</p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-7 mt-2"
                  >
                    <p className="text-[12px] text-black leading-snug mb-2">{solution.fullDescription}</p>
                    {solution.features && solution.features.length > 0 && (
                      <div className="text-[10px] space-y-1 mb-2">
                        {solution.features.map((feature, fi) => (
                          <div key={fi} className="flex items-start gap-1.5">
                            <span className="text-[#007f99] flex-shrink-0 mt-0.5">•</span>
                            <span className="text-black">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {solution.brands && solution.brands.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {solution.brands.map((brand, bi) => (
                          <a
                            key={bi}
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#f3f4f6] rounded px-2 py-1 hover:bg-[#e5e7eb] transition-colors"
                            title={`Visit ${brand.name}`}
                          >
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={60}
                              height={20}
                              className="h-3.5 w-auto object-contain"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/solution/${solution.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex text-[11px] font-semibold text-[#0a0b85] hover:text-[#08096e] mt-2"
                    >
                      Learn More →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-2 md:mt-3 text-[9px] sm:text-[10px] font-bold text-black">tap to expand</p>
    </div>
  );
}

function ServicesColumn({ services }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="h-full min-h-0 flex flex-col px-4 sm:px-6 md:px-7 py-4 sm:py-5 md:py-6">
      <div className="sticky top-0 z-10 bg-white/92 backdrop-blur-sm pb-2 md:pb-3">
        <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-black uppercase">Services</p>
        <h3 className="mt-1.5 text-3xl sm:text-4xl md:text-5xl font-extrabold text-black">Professional</h3>
      </div>

      <div className="no-scrollbar mt-1.5 space-y-2.5 md:space-y-3.5 overflow-y-auto pr-1 flex-1 min-h-0 max-h-96 md:max-h-none">
        {services.map((service, i) => {
          const Icon = LucideIcons[service.icon] || LucideIcons.Cog;
          const isExpanded = expandedIndex === i;

          return (
            <div key={`${service.name}-${i}`}>
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full text-left flex items-start gap-2.5 font-bold text-black leading-tight hover:text-[#0a0b85] transition-colors group"
              >
                <Icon size={19} className="mt-1 text-[#007f99] group-hover:text-[#0a0b85] flex-shrink-0" />
                <span className="text-[18px] sm:text-[21px] flex-1">{service.name}</span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 mt-1"
                >
                  <LucideIcons.ChevronDown size={18} />
                </motion.div>
              </button>
              <p className="ml-7 text-[12px] sm:text-[14px] text-black mt-0.5 leading-snug">{service.description}</p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-7 mt-2"
                  >
                    {service.details && (
                      <p className="text-[12px] text-black leading-snug mb-2">{service.details}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-2 md:mt-3 text-[9px] sm:text-[10px] font-bold text-black">tap to expand</p>
    </div>
  );
}

export default function SolutionServicesGrid({ solutions, services }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="relative w-full bg-transparent border-t border-[#bebebe73] py-10 sm:py-12 md:py-0 md:min-h-screen">
      <div className="w-full h-full border-y border-[#dbdbdb] bg-white/22 backdrop-blur-[2px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-full">
          {/* Solutions Column */}
          <div
            className={`bg-[#f4f5f7]/82 h-full min-h-0 transition-all duration-300 ${
              hovered === 'right' ? 'md:opacity-45' : 'md:opacity-100'
            }`}
            onMouseEnter={() => setHovered('left')}
            onMouseLeave={() => setHovered(null)}
          >
            <SolutionColumn solutions={solutions} />
          </div>

          {/* Services Column */}
          <div
            className={`bg-[#f2f3f5]/82 h-full min-h-0 transition-all duration-300 ${
              hovered === 'left' ? 'md:opacity-45' : 'md:opacity-100'
            }`}
            onMouseEnter={() => setHovered('right')}
            onMouseLeave={() => setHovered(null)}
          >
            <ServicesColumn services={services} />
          </div>
        </div>
      </div>
    </section>
  );
}
