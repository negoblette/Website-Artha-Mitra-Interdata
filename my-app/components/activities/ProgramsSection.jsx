'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, ChevronDown, ArrowUpRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function ProgramCard({ program, index }) {
  const [expanded, setExpanded] = useState(false);
  const images = program.images ?? [];
  const primaryImage = images[0];
  const galleryImages = images.slice(1, 4);

  return (
    <AnimatedSection delay={index * 0.1} className="self-start">
      <motion.div
        layout
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="w-full self-start cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-[#f7f8fb] shadow-[0_30px_90px_rgba(10,11,133,0.16)] transition-all duration-500 hover:shadow-[0_36px_100px_rgba(10,11,133,0.22)]">
          <div className="absolute inset-0 rounded-[2rem] border border-[#0a0b85]/8 pointer-events-none" />

          <div className="relative grid min-h-[200px] grid-cols-1 md:min-h-[100px] md:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 flex flex-col justify-between bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] px-5 py-6 sm:px-6 sm:py-7 lg:px-7 lg:py-8">
              <div className="absolute inset-y-0 right-[-40px] hidden w-[88px] bg-white [clip-path:polygon(24%_0%,100%_0%,76%_100%,0%_100%)] md:block" />

              <div className="relative max-w-xl">
                <span className="inline-flex rounded-full border border-[#00a86b]/15 bg-[#00a86b]/8 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#00a86b] sm:text-xs">
                  Program
                </span>

                <h3 className="mt-4 text-2xl font-black uppercase leading-tight text-[#111a5b] sm:text-[1.95rem] lg:text-[2.2rem]">
                  {program.name}
                </h3>

                <p className={`mt-4 max-w-md text-sm leading-6 text-[#4b556b] sm:text-[15px] ${expanded ? '' : 'line-clamp-4'}`}>
                  {program.description}
                </p>

                <div className="mt-5 space-y-2 text-xs text-[#29324f] sm:text-sm">
                  <p className="font-bold">Part of AMI activities</p>
                  <p>
                    <span className="font-semibold text-[#00a86b]">Focus:</span> community engagement and professional development
                  </p>
                </div>
              </div>

              <div className="relative mt-6 flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#1fb92f] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(31,185,47,0.28)] transition-all duration-300 hover:bg-[#18a528]"
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                >
                  <span>{expanded ? 'Hide Details' : 'Explore Details'}</span>
                  <motion.span
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <span className="inline-flex items-center gap-2 rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a0b85]">
                  AMI Activity
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 overflow-hidden"
                  >
                    <div className="mt-5 max-w-md rounded-[1.35rem] border border-[#0a0b85]/8 bg-[#f4f7ff] p-4">
                      <p className="text-sm leading-6 text-[#5b6b82]">
                        This program is part of AMI&apos;s commitment to community engagement and professional development in the IT industry across Indonesia.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative min-h-[240px] overflow-hidden bg-[radial-gradient(circle_at_50%_36%,rgba(80,255,132,0.78),rgba(80,255,132,0.18)_20%,transparent_36%),linear-gradient(180deg,#071745_0%,#0b2f7c_42%,#163c14_100%)] md:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_14%,rgba(255,232,122,0.85),transparent_12%),radial-gradient(circle_at_16%_72%,rgba(26,185,255,0.18),transparent_18%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(124,197,38,0)_0%,rgba(136,214,49,0.34)_18%,rgba(124,197,38,0.96)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/20" />

              <div className="relative flex h-full items-end justify-center px-4 pt-8">
                {primaryImage ? (
                  <div className="relative h-[220px] w-full max-w-[250px] sm:h-[260px] sm:max-w-[290px] lg:h-[300px] lg:max-w-[320px]">
                    <Image
                      src={primaryImage}
                      alt={`${program.name} cover`}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 768px) 28vw, 90vw"
                      className="object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.35)] transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="flex h-[190px] w-[190px] items-center justify-center rounded-full border border-white/18 bg-white/10 backdrop-blur-sm sm:h-[220px] sm:w-[220px]">
                    <Mountain className="h-14 w-14 text-white/85" />
                  </div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {galleryImages.map((imageSrc, j) => (
                    <div
                      key={j}
                      className="relative h-11 w-11 overflow-hidden rounded-lg border border-white/25 bg-white/10 backdrop-blur-sm sm:h-12 sm:w-12"
                    >
                      <Image
                        src={imageSrc}
                        alt={`${program.name} image ${j + 2}`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function ProgramsSection({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const programs = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil(programs.length / itemsPerPage));
  const paginatedItems = programs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section className="relative mt-14 py-28 sm:mt-20 lg:mt-24">
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-20">
        <AnimatedSection>
          <div className="mb-5 sm:mb-7 max-w-2xl">
            <div className="mb-1 ">
              <h2 className="text-[35px] uppercase sm:text-[50px] font-black gradient-text inline-block">
                {data.title}
              </h2>
            </div>
            <p className="text-[#111827]/65 font-semibold sm:text-[18px]">{data.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {paginatedItems.map((program, i) => (
            <ProgramCard key={i} program={program} index={i} />
          ))}
        </div>

        {programs.length > itemsPerPage && (
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
