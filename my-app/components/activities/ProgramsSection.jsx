'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const PROGRAM_FALLBACK_IMAGE = '/images/activities.jpeg';

function ProgramCard({ program, index }) {
  const [expanded, setExpanded] = useState(false);
  const images = (program.images ?? []).filter(Boolean);
  const primaryImage = images[0] || PROGRAM_FALLBACK_IMAGE;
  const galleryImages = images.slice(1, 4);

  return (
    <AnimatedSection delay={index * 0.1} className="mb-5 break-inside-avoid sm:mb-6">
      <div className="h-full w-full">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25 }}
          className="group relative h-full overflow-hidden rounded-[2rem] border border-white/70 bg-[#f7f8fb] shadow-[0_30px_90px_rgba(10,11,133,0.16)] transition-all duration-500 hover:shadow-[0_36px_100px_rgba(10,11,133,0.22)]"
        >
          <div className="absolute inset-0 rounded-[2rem] border border-[#0a0b85]/8 pointer-events-none" />

          {/* GRID */}
          <div className="relative flex min-h-[200px] flex-col xl:min-h-[100px] xl:flex-row">

            {/* LEFT */}
            <div className="relative z-10 flex flex-1 flex-col justify-between bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] py-5 pl-6 pr-6 sm:py-6 sm:pl-7 sm:pr-7 xl:w-[52.5%] xl:py-8 xl:pl-12 xl:pr-11">
              <div className="absolute inset-y-0 right-[-17px] z-0 hidden w-[72px] bg-white [clip-path:polygon(24%_0%,100%_0%,76%_100%,0%_100%)] xl:block" />

              <div className="relative z-10 max-w-xl space-y-4 sm:space-y-5">
                {/* <span className="inline-flex rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#0a0b85] sm:text-xs">
                  Program
                </span> */}

                <h3 className="max-w-xl text-[13px] text-[1.55rem] font-black leading-[1.05] tracking-tight text-[rgb(13,27,94)] sm:text-[1.9rem] xl:text-[2.3rem]">
                  {program.name}
                </h3>

                <p className={`max-w-xl text-[13px] text-justify font-medium leading-6 text-[#111827]/72 sm:text-sm ${expanded ? '' : 'line-clamp-4 sm:line-clamp-4'}`}>
                  {program.description}
                </p>

                <div className="space-y-2 rounded-[1.15rem] border border-[#0a0b85]/8 bg-[#f8faff] px-4 py-3 text-[11px] text-[#29324f] sm:text-sm">
                  <p className="font-bold leading-5 text-[rgb(13,27,94)]">{program.summaryLabel}</p>
                  <p className="leading-6">
                    <span className="font-semibold text-[#00a86b]">{program.focusLabel}</span>{' '}
                    {program.focusText}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a0b85] sm:w-auto"
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                >
                  <span>{expanded ? 'Hide Details' : 'Explore Details'}</span>
                  <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="relative z-10 mt-5 max-w-full rounded-[1.35rem] border border-[#0a0b85]/8 bg-[#f4f7ff] p-4 sm:max-w-md sm:p-5">
                      <p className="text-sm leading-6 text-[#5b6b82]">
                        {program.detail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT (FULL IMAGE FIX) */}
            <div className="relative min-h-[220px] overflow-hidden sm:min-h-[260px] xl:min-h-0 xl:w-[47.5%] xl:flex-none xl:self-stretch">
              <div className="absolute inset-0">
                <Image
                  src={primaryImage}
                  alt={`${program.name} cover`}
                  fill
                  sizes="(min-width: 1280px) 22vw, (min-width: 640px) 80vw, 92vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* overlay biar lebih estetik */}
              <div className="absolute inset-0 bg-black/10" />

              {galleryImages.length > 0 && (
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {galleryImages.map((imageSrc, j) => (
                    <div key={j} className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/25 sm:h-11 sm:w-11">
                      <Image
                        src={imageSrc}
                        alt={`${program.name} image ${j + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

export default function ProgramsSection({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const programs = data?.items ?? [];

  const totalPages = Math.max(1, Math.ceil(programs.length / itemsPerPage));
  const paginatedItems = programs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="relative z-10 mt-14  pt-20 pb-10 sm:mt-20 lg:mt-24">
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-20">
        <AnimatedSection>
          <div className="mb-5 sm:mb-7 max-w-2xl">
            <h2 className="font-black tracking-tight text-[rgb(13,27,94)] sm:text-5xl inline-block">
              {data.title}
            </h2>
            <p className="text-[#111827] text-[13px] font-base sm:text-lg max-w-2xl">
              {data.subtitle}
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2 xl:gap-6">
          {paginatedItems.map((program, i) => (
            <ProgramCard key={i} program={program} index={i} />
          ))}
        </div>

        {programs.length > itemsPerPage && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-[#010268]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#010268] disabled:opacity-40"
            >
              Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-full px-3 text-xs font-semibold ${
                      isActive
                        ? 'bg-[#010268] text-white'
                        : 'border border-[#010268]/10 bg-white text-[#010268]'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-[#010268]/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#010268] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
