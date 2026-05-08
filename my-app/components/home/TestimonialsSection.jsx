"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

const EMPTY_ITEMS = [];

export default function TestimonialsSection({ data }) {
  const items = data?.items ?? EMPTY_ITEMS;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollCooldown = useRef(false);
  const leftPanelRef = useRef(null);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Attach wheel listener with { passive: false } so preventDefault works
  useEffect(() => {
    const el = leftPanelRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (scrollCooldown.current) return;
      scrollCooldown.current = true;

      if (e.deltaY > 0) goNext();
      else goPrev();

      setTimeout(() => {
        scrollCooldown.current = false;
      }, 600);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  if (!items.length) return null;

  const prevIdx = (activeIndex - 1 + items.length) % items.length;
  const nextIdx = (activeIndex + 1) % items.length;
  const activeItem = items[activeIndex];

  const slots = [
    { index: prevIdx, position: "top" },
    { index: activeIndex, position: "middle" },
    { index: nextIdx, position: "bottom" },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section title — centered, matching HowItWorks heading size */}
        <h2 className="mx-auto max-w-5xl text-center text-2xl sm:text-4xl font-black tracking-[-0.05em] text-[#080d63] lg:text-[4.2rem] lg:leading-[1.05] mb-8 sm:mb-12">
          What People Says
        </h2>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-10 xl:gap-14">
          {/* ── Left: fixed-height vertical reviewer selector ── */}
          <div
            ref={leftPanelRef}
            className="relative flex flex-row lg:flex-col items-center justify-center lg:h-[320px] select-none"
          >
            {/* Vertical connecting line (desktop) */}
            <div className="hidden lg:block absolute left-[36px] top-[24px] bottom-[24px] w-px bg-gradient-to-b from-[#e4e4e7] via-[#cdcdd4] to-[#e4e4e7]" />
            {/* Horizontal connecting line (mobile) */}
            <div className="lg:hidden absolute top-[34px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#d4d4d8] to-transparent" />

            {slots.map(({ index, position }) => {
              const item = items[index];
              const isActive = position === "middle";

              return (
                <button
                  key={`${index}-${position}`}
                  onClick={() => {
                    if (position === "top") goPrev();
                    else if (position === "bottom") goNext();
                  }}
                  className={`relative z-10 flex items-center gap-4 transition-all duration-500 ease-out w-full
                    ${position === "middle"
                      ? "lg:my-5 lg:flex-1 cursor-default"
                      : "lg:my-0 cursor-pointer"
                    }
                    ${isActive ? "opacity-100" : "opacity-30 hover:opacity-55"}
                  `}
                >
                  {/* Logo circle */}
                  <div
                    className={`relative shrink-0 rounded-full bg-white overflow-hidden flex items-center justify-center transition-all duration-500
                      ${isActive
                        ? "w-[72px] h-[72px] border-2 border-[#0d1364] shadow-[0_8px_24px_rgba(13,19,100,0.14)]"
                        : "w-11 h-11 border border-[#d4d4d8]"
                      }
                    `}
                  >
                    <div className={`relative transition-all duration-500 ${isActive ? "w-11 h-11" : "w-6 h-6"}`}>
                      <Image
                        src={item.logo || item.image || "/logo.png"}
                        alt={item.author}
                        fill
                        sizes={isActive ? "44px" : "24px"}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Name & role */}
                  <div className={`text-left transition-all duration-500 min-w-0 ${isActive ? "" : "hidden sm:block"}`}>
                    <p
                      className={`font-bold text-[#0d1364] leading-tight transition-all duration-500
                        ${isActive ? "text-[15px] sm:text-lg" : "text-xs"}
                      `}
                    >
                      {item.author}
                    </p>
                    {item.role && (
                      <p
                        className={`text-black/40 leading-snug mt-0.5 transition-all duration-500
                          ${isActive ? "text-xs sm:text-[13px]" : "text-[10px]"}
                        `}
                      >
                        {item.role}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Scroll hint (desktop) */}
            <div className="hidden lg:flex absolute -bottom-7 left-0 right-0 items-center justify-center gap-1.5 text-[10px] text-black/25 font-medium tracking-wide">
              <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              scroll to navigate
            </div>
          </div>

          {/* ── Right: testimonial text ── */}
          <div className="relative flex items-start lg:min-h-[320px]">
            {/* Large quotation mark */}
            <span className="select-none text-[4rem] sm:text-[5rem] leading-none font-serif text-[#0d1364]/8 -mt-2 sm:-mt-3 mr-1 sm:mr-3 shrink-0">
              &ldquo;
            </span>

            {/* Testimonial content */}
            <div className="pt-3 sm:pt-5 flex flex-col justify-center">
              <p className="text-sm sm:text-[15px] lg:text-base font-normal italic leading-[1.75] sm:leading-[1.85] text-[#444] max-w-xl text-justify">
                {activeItem.text}
              </p>

              {/* Author (mobile only — desktop shows on left) */}
              <div className="mt-5 lg:hidden">
                <p className="font-bold text-[#0d1364] text-sm">{activeItem.author}</p>
                {activeItem.role && (
                  <p className="text-[11px] text-black/40 mt-0.5">{activeItem.role}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
