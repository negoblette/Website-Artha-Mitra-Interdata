"use client";

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function TestimonialsSection({ data }) {
  const itemsPerPage = 3;
  const pages = useMemo(() => {
    const source = data.items || [];
    if (!source.length) return [];

    const chunked = [];
    for (let i = 0; i < source.length; i += itemsPerPage) {
      chunked.push(source.slice(i, i + itemsPerPage));
    }
    return chunked;
  }, [data.items]);

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
    <section className="home-section relative bg-transparent md:h-[calc(100svh-98px)] md:py-0">
      <div className="absolute inset-0 bg-white pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:h-full md:flex md:flex-col md:justify-center">
        <h2 className="text-center text-[50px] font-black text-[rgb(13,27,94)]">What People Say</h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {currentItems.map((item) => (
              <article key={`${item.author}-${item.text.slice(0, 24)}`} className="rounded-2xl bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-5 text-white min-h-56">
                <p className="text-sm font-semibold leading-relaxed text-white/95">{item.text}</p>
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


