"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

function getItemsPerPage() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 768) return 1;
  return 3;
}

export default function TestimonialsSection({ data }) {
  const items = data.items || [];
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [activePage, setActivePage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [trackIndex, setTrackIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const syncItemsPerPage = () => {
      setItemsPerPage(getItemsPerPage());
    };

    syncItemsPerPage();
    window.addEventListener('resize', syncItemsPerPage);

    return () => window.removeEventListener('resize', syncItemsPerPage);
  }, []);

  const pages = useMemo(() => {
    if (!items.length) return [];

    const chunked = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      chunked.push(items.slice(i, i + itemsPerPage));
    }
    return chunked;
  }, [items, itemsPerPage]);

  const loopPages = useMemo(() => {
    if (!pages.length) return [];
    if (pages.length === 1) return pages;
    return [pages[pages.length - 1], ...pages, pages[0]];
  }, [pages]);

  useEffect(() => {
    setActivePage(0);
    setTrackIndex(pages.length > 1 ? 1 : 0);
    setIsAnimating(true);
  }, [itemsPerPage]);

  useEffect(() => {
    if (pages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActivePage((prev) => (prev + 1) % pages.length);
      setTrackIndex((prev) => prev + 1);
    }, 4200);

    return () => clearInterval(timer);
  }, [isPaused, pages.length]);

  const goToPage = (index) => {
    if (!pages.length) return;
    const normalizedIndex = (index + pages.length) % pages.length;
    setIsAnimating(true);
    setActivePage(normalizedIndex);
    setTrackIndex(pages.length > 1 ? normalizedIndex + 1 : normalizedIndex);
  };

  const handleSlideComplete = () => {
    if (pages.length <= 1) return;

    if (trackIndex === pages.length + 1) {
      setIsAnimating(false);
      setTrackIndex(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    }

    if (trackIndex === 0) {
      setIsAnimating(false);
      setTrackIndex(pages.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    }
  };

  if (!pages.length) return null;

  return (
    <section className="home-section relative bg-transparent md:h-[calc(100svh-98px)] md:py-0">
      <img 
        src="/decor/careerelements.svg" 
        alt="" 
        aria-hidden="true"
        className="pointer-events-none rotate-x-180 top-[-6rem] absolute top-0 left-1/2 h-full w-[115vw] max-w-none -translate-x-1/2 object-cover object-center opacity-100 blur-[1px]"

      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:h-full md:flex md:flex-col md:justify-center">
        <h2 className="text-center text-4xl sm:text-5xl font-black text-black">{data.title}</h2>

        <div
          className="mt-9 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex"
            animate={{ x: `-${trackIndex * 100}%` }}
            transition={isAnimating ? { duration: 0.9, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
            onAnimationComplete={handleSlideComplete}
          >
            {loopPages.map((page, pageIndex) => (
              <div key={pageIndex} className="w-full shrink-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {page.map((item) => (
                    <article
                      key={`${item.author}-${item.text.slice(0, 24)}`}
                      className="flex min-h-56 flex-col justify-between rounded-2xl bg-[#0a0b85] p-5 text-white shadow-[0_18px_38px_rgba(10,11,133,0.16)]"
                    >
                      <p className="text-sm leading-relaxed text-white/95">{item.text}</p>
                      <p className="mt-6 text-base font-semibold">{item.author}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-1.5">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial slide ${i + 1}`}
                onClick={() => goToPage(i)}
                className={`rounded-full transition-all duration-300 ${i === activePage ? 'h-1.5 w-14 bg-black' : 'h-1.5 w-4 bg-black/30 hover:bg-black/65'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


