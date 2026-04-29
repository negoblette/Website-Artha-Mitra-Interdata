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
    <AnimatedSection delay={index * 0.1} className="mb-6 break-inside-avoid">
      <motion.div
        layout
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="h-full w-full cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="group relative h-full overflow-hidden rounded-[2rem] border border-white/70 bg-[#f7f8fb] shadow-[0_30px_90px_rgba(10,11,133,0.16)] transition-all duration-500 hover:shadow-[0_36px_100px_rgba(10,11,133,0.22)]">
          <div className="absolute inset-0 rounded-[2rem] border border-[#0a0b85]/8 pointer-events-none" />

          {/* GRID */}
          <div className="relative flex min-h-[200px] flex-col md:min-h-[100px] md:flex-row">

            {/* LEFT */}
            <div className="relative z-10 flex flex-1 flex-col justify-between bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] px-5 py-6 sm:px-6 sm:py-7 md:w-[52.5%] lg:px-7 lg:py-8">
              <div className="absolute inset-y-0 right-[-40px] hidden w-[88px] bg-white [clip-path:polygon(24%_0%,100%_0%,76%_100%,0%_100%)] md:block" />

              <div className="relative max-w-xl">
                {/* <span className="inline-flex rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#0a0b85] sm:text-xs">
                  Program
                </span> */}

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
                  className="inline-flex items-center gap-2 rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0a0b85]"
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                >
                  <span>{expanded ? 'Hide Details' : 'Explore Details'}</span>
                  <motion.span animate={{ rotate: expanded ? 180 : 0 }}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
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

            {/* RIGHT (FULL IMAGE FIX) */}
            <div className="relative min-h-[240px] overflow-hidden md:min-h-0 md:w-[47.5%] md:flex-none md:self-stretch">
              <div className="absolute inset-0">
                <Image
                  src={primaryImage}
                  alt={`${program.name} cover`}
                  fill
                  sizes="(min-width: 640px) 22vw, (min-width: 320px) 28vw, 90vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* overlay biar lebih estetik */}
              <div className="absolute inset-0 bg-black/10" />

              {galleryImages.length > 0 && (
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {galleryImages.map((imageSrc, j) => (
                    <div key={j} className="relative h-11 w-11 overflow-hidden rounded-lg border border-white/25">
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
  const paginatedItems = programs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="relative mt-14 py-28 sm:mt-20 lg:mt-24">
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-20">
        <AnimatedSection>
          <div className="mb-5 sm:mb-7 max-w-2xl">
            <h2 className="text-[35px] uppercase sm:text-[50px] font-black gradient-text inline-block">
              {data.title}
            </h2>
            <p className="text-[#111827]/65 font-semibold sm:text-[18px]">
              {data.subtitle}
            </p>
          </div>
        </AnimatedSection>

        <div className="columns-1 gap-6 md:columns-2">
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
