"use client";

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function TestimonialsSection({ data }) {
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const syncItemsPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(3);
      } else if (width >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    syncItemsPerPage();
    window.addEventListener('resize', syncItemsPerPage);
    return () => window.removeEventListener('resize', syncItemsPerPage);
  }, []);

  const pages = useMemo(() => {
    const source = data.items || [];
    if (!source.length) return [];

    const chunked = [];
    for (let i = 0; i < source.length; i += itemsPerPage) {
      chunked.push(source.slice(i, i + itemsPerPage));
    }
    return chunked;
  }, [data.items, itemsPerPage]);

  const [activePage, setActivePage] = useState(0);
  const [manualTrigger, setManualTrigger] = useState(0);

  useEffect(() => {
    setActivePage(0);
  }, [pages.length]);

  useEffect(() => {
    if (pages.length <= 1) return;

    const timer = setTimeout(() => {
      setActivePage((prev) => (prev + 1) % pages.length);
    }, 4500);

    return () => clearTimeout(timer);
  }, [activePage, pages.length, manualTrigger]);

  const currentItems = pages[activePage] || [];

  return (
    <section className="home-section relative bg-transparent py-10 sm:py-12 md:py-16 lg:py-20">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-4xl sm:text-5xl font-black text-black">What People Says</h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-6 sm:mt-8 md:mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {currentItems.map((item) => (
              <article key={`${item.author}-${item.text.slice(0, 24)}`} className="rounded-2xl bg-[#0a0b85] p-4 sm:p-5 text-white min-h-[13rem] sm:min-h-56">
                <p className="text-sm leading-relaxed text-white/95">{item.text}</p>
                <p className="mt-6 text-base font-semibold">{item.author}</p>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center items-center gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to testimonial slide ${i + 1}`}
              onClick={() => {
                setActivePage(i);
                setManualTrigger((prev) => prev + 1);
              }}
              className={`transition-all duration-200 rounded-full ${i === activePage ? 'h-1 w-16 bg-black' : 'h-1.5 w-1.5 bg-black/55 hover:bg-black/85'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


