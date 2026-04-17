"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const EMPTY_ITEMS = [];

function getItemsPerPage() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  return 3;
}

export default function TestimonialsSection({ data }) {
  const items = data?.items ?? EMPTY_ITEMS;

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const GAP = 20;

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      setContainerWidth(containerRef.current.offsetWidth);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const loopItems = useMemo(() => {
    if (!items.length) return [];

    return [
      ...items.slice(-itemsPerPage),
      ...items,
      ...items.slice(0, itemsPerPage),
    ];
  }, [items, itemsPerPage]);

  const cardWidth =
    itemsPerPage > 0
      ? (containerWidth - GAP * (itemsPerPage - 1)) / itemsPerPage
      : 0;

  const step = cardWidth + GAP;

  useEffect(() => {
    if (!items.length) return;

    const frame = requestAnimationFrame(() => {
      setTrackIndex(itemsPerPage);
    });

    return () => cancelAnimationFrame(frame);
  }, [itemsPerPage, items.length]);

  useEffect(() => {
    if (!items.length || isPaused) return;

    const timer = setInterval(() => {
      setTrackIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, items.length]);

  const handleComplete = () => {
    if (!items.length) return;

    if (trackIndex >= items.length + itemsPerPage) {
      setIsAnimating(false);
      setTrackIndex(itemsPerPage);
    }

    if (trackIndex < itemsPerPage) {
      setIsAnimating(false);
      setTrackIndex(items.length + itemsPerPage - 1);
    }
  };

  useEffect(() => {
    if (!isAnimating) {
      const id = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isAnimating]);

  const totalPages = items.length;

  const activePage =
    (trackIndex - itemsPerPage + items.length) % items.length;
 
  if (!items.length) return null;

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-transparent">
      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-[115vw] -translate-x-1/2">
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 py-0 sm:px-6">
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl text-[rgba(13,27,94)] font-black">
          {data?.title || "Testimonials"}
        </h2>

        <div
          ref={containerRef}
          className="overflow-hidden mt-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className="flex"
            animate={{ x: -(trackIndex * step) }}
            transition={
              isAnimating
                ? { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
                : { duration: 0 }
            }
            onAnimationComplete={handleComplete}
          >
            {loopItems.map((item, i) => (
              <div
                key={i}
                style={{
                  minWidth: `${cardWidth}px`,
                  marginRight: `${GAP}px`,
                }}
              >
                <article className="flex min-h-56 flex-col justify-between rounded-2xl bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-5 text-white">
                  <p className="text-sm">{item.text}</p>
                  <p className="mt-6 font-semibold">{item.author}</p>
                </article>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="flex justify-center mt-8 gap-2 pb-0">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAnimating(true);
                setTrackIndex(i + itemsPerPage);
              }}
              className={`h-1 rounded-full transition-all ${
                i === activePage ? "w-10 bg-black" : "w-3 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
