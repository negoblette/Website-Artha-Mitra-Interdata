// "use client";

// import { useEffect, useMemo, useState, useRef } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";

// const EMPTY_ITEMS = [];

// function getItemsPerPage() {
//   if (typeof window === "undefined") return 3;
//   if (window.innerWidth < 768) return 1;
//   return 3;
// }

// export default function TestimonialsSection({ data }) {
//   const items = data?.items ?? EMPTY_ITEMS;

//   const [itemsPerPage, setItemsPerPage] = useState(3);
//   const [trackIndex, setTrackIndex] = useState(1);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(true);

//   // ✅ REF UNTUK WIDTH
//   const containerRef = useRef(null);
//   const [slideWidth, setSlideWidth] = useState(0);

//   // ✅ RESPONSIVE
//   useEffect(() => {
//     const sync = () => setItemsPerPage(getItemsPerPage());
//     sync();
//     window.addEventListener("resize", sync);
//     return () => window.removeEventListener("resize", sync);
//   }, []);

//   // ✅ HITUNG WIDTH REAL
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const updateWidth = () => {
//       setSlideWidth(containerRef.current.offsetWidth);
//     };

//     updateWidth();
//     window.addEventListener("resize", updateWidth);
//     return () => window.removeEventListener("resize", updateWidth);
//   }, []);

//   // ✅ CHUNK ITEMS
//   const pages = useMemo(() => {
//     if (!items.length) return [];

//     const chunked = [];
//     for (let i = 0; i < items.length; i += itemsPerPage) {
//       chunked.push(items.slice(i, i + itemsPerPage));
//     }
//     return chunked;
//   }, [items, itemsPerPage]);

//   // ✅ CLONE UNTUK INFINITE
//   const loopPages = useMemo(() => {
//     if (!pages.length) return [];
//     if (pages.length === 1) return pages;
//     return [pages[pages.length - 1], ...pages, pages[0]];
//   }, [pages]);

//   // ✅ RESET POSISI AWAL
//   useEffect(() => {
//     const frame = requestAnimationFrame(() => {
//       setTrackIndex(pages.length > 1 ? 1 : 0);
//       setIsAnimating(true);
//     });

//     return () => cancelAnimationFrame(frame);
//   }, [pages.length, itemsPerPage]);

//   // ✅ AUTO SLIDE
//   useEffect(() => {
//     if (pages.length <= 1 || isPaused) return;

//     const timer = setInterval(() => {
//       setTrackIndex((prev) => prev + 1);
//     }, 4200);

//     return () => clearInterval(timer);
//   }, [pages.length, isPaused]);

//   // ✅ ACTIVE DOT
//   const activePage =
//     pages.length > 0
//       ? (trackIndex - 1 + pages.length) % pages.length
//       : 0;

//   // ✅ DOT NAVIGATION
//   const goToPage = (index) => {
//     setIsAnimating(true);
//     setTrackIndex(index + 1);
//   };

//   // ✅ INFINITE LOOP FIX (NO GLITCH)
//   const handleSlideComplete = () => {
//     if (pages.length <= 1) return;

//     if (trackIndex === pages.length + 1) {
//       setIsAnimating(false);
//       setTrackIndex(1);
//     }

//     if (trackIndex === 0) {
//       setIsAnimating(false);
//       setTrackIndex(pages.length);
//     }
//   };

//   // ✅ RE-ACTIVATE ANIMATION
//   useEffect(() => {
//     if (!isAnimating) {
//       const id = requestAnimationFrame(() => setIsAnimating(true));
//       return () => cancelAnimationFrame(id);
//     }
//   }, [isAnimating]);

//   if (!pages.length) return null;

//   return (
//     <section className="home-section relative bg-transparent md:h-[calc(100svh-98px)] md:py-0">
//       <div className="pointer-events-none absolute top-0 left-1/2 h-full w-[115vw] -translate-x-1/2 rotate-x-180">
//         <Image
//           src="/decor/careerelements.svg"
//           alt=""
//           aria-hidden="true"
//           fill
//           sizes="115vw"
//           className="object-cover object-center opacity-100 blur-[1px]"
//         />
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:h-full md:flex md:flex-col md:justify-center">
//         <h2 className="text-center text-4xl sm:text-5xl font-black text-black">
//           {data?.title || 'Testimonials'}
//         </h2>

//         <div
//           className="mt-9 overflow-hidden"
//           onMouseEnter={() => setIsPaused(true)}
//           onMouseLeave={() => setIsPaused(false)}
//         >
//           <motion.div
//             className="flex"
//             animate={{ x: `-${trackIndex * 100}%` }}
//             transition={isAnimating ? { duration: 0.8, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
//             onAnimationComplete={handleSlideComplete}
//           >
//             {loopPages.map((page, pageIndex) => (
//               <div key={pageIndex} className="w-full shrink-0">
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                   {page.map((item) => (
//                     <article
//                       key={`${item.author}-${item.text.slice(0, 24)}`}
//                       className="flex min-h-56 flex-col justify-between rounded-2xl bg-[#0a0b85] p-5 text-white shadow-[0_18px_38px_rgba(10,11,133,0.16)]"
//                     >
//                       <p className="text-sm leading-relaxed text-white/95">{item.text}</p>
//                       <p className="mt-6 text-base font-semibold">{item.author}</p>
//                     </article>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         </div>

//         <div className="mt-8 flex items-center justify-center">
//           <div className="flex items-center gap-1.5">
//             {pages.map((_, i) => (
//               <button
//                 key={i}
//                 type="button"
//                 aria-label={`Go to testimonial slide ${i + 1}`}
//                 onClick={() => goToPage(i)}
//                 className={`rounded-full transition-all duration-300 ${i === activePage ? 'h-1.5 w-14 bg-black' : 'h-1.5 w-4 bg-black/30 hover:bg-black/65'}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
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

  // ✅ responsive items
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ container width
  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      setContainerWidth(containerRef.current.offsetWidth);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ✅ clone items (infinite)
  const loopItems = useMemo(() => {
    if (!items.length) return [];

    return [
      ...items.slice(-itemsPerPage),
      ...items,
      ...items.slice(0, itemsPerPage),
    ];
  }, [items, itemsPerPage]);

  // ✅ ukuran card
  const cardWidth =
    itemsPerPage > 0
      ? (containerWidth - GAP * (itemsPerPage - 1)) / itemsPerPage
      : 0;

  const step = cardWidth + GAP;

  // ✅ reset awal
  useEffect(() => {
    if (!items.length) return;

    const frame = requestAnimationFrame(() => {
      setTrackIndex(itemsPerPage);
    });

    return () => cancelAnimationFrame(frame);
  }, [itemsPerPage, items.length]);

  // ✅ auto slide (per CARD, bukan per page)
  useEffect(() => {
    if (!items.length || isPaused) return;

    const timer = setInterval(() => {
      setTrackIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, items.length]);

  // ✅ infinite reset
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

  // ✅ re-enable animasi
  useEffect(() => {
    if (!isAnimating) {
      const id = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isAnimating]);

  // ✅ DOT (berdasarkan kelompok 3)
  const totalPages = items.length;

  const activePage =
    (trackIndex - itemsPerPage + items.length) % items.length;
 
  if (!items.length) return null;

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-transparent">
      {/* BG */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-[115vw] -translate-x-1/2">
        <Image
          src="/decor/careerelements.svg"
          alt=""
          fill
          className="object-cover blur-[1px]"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 py-0 sm:px-6">
        <h2 className="text-center text-4xl font-black">
          {data?.title || "Testimonials"}
        </h2>

        {/* CAROUSEL */}
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
                <article className="flex min-h-56 flex-col justify-between rounded-2xl bg-[#0a0b85] p-5 text-white">
                  <p className="text-sm">{item.text}</p>
                  <p className="mt-6 font-semibold">{item.author}</p>
                </article>
              </div>
            ))}
          </motion.div>
        </div>

        {/* DOT */}
        <div className="flex justify-center mt-8 gap-2 pb-0">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAnimating(true);
                setTrackIndex(i + itemsPerPage);
              }}
              className={`h-2 rounded-full transition-all ${
                i === activePage ? "w-10 bg-black" : "w-3 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
