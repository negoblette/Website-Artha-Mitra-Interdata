"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

const EMPTY_ITEMS = [];

export default function TestimonialsSection({ data }) {
  const items = data?.items ?? EMPTY_ITEMS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDir, setTransitionDir] = useState("next");
  const scrollCooldown = useRef(false);
  const leftPanelRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const autoIntervalRef = useRef(null);
  const isHoveringRef = useRef(false);

  const goNext = useCallback(() => {
    setTransitionDir("next");
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setTransitionDir("prev");
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    setIsTransitioning(true);
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 360);
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [activeIndex]);

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

  useEffect(() => {
    if (!items.length) return;

    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
    }

    autoIntervalRef.current = setInterval(() => {
      if (isHoveringRef.current) return;
      goNext();
    }, 5000);

    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, [items.length, goNext]);

  if (!items.length) return null;

  const prevIdx = (activeIndex - 1 + items.length) % items.length;
  const nextIdx = (activeIndex + 1) % items.length;
  const activeItem = items[activeIndex];
  const textMotion = isTransitioning
    ? transitionDir === "next"
      ? "opacity-0 translate-y-3"
      : "opacity-0 -translate-y-3"
    : "opacity-100 translate-y-0";
  const textLength = activeItem?.text?.length ?? 0;
  const textScaleClass =
    textLength > 520
      ? "lg:text-[0.875rem] lg:leading-[1.55]"
      : textLength > 360
        ? "lg:text-[0.9375rem] lg:leading-[1.65]"
        : "lg:text-base lg:leading-[1.75]";

  const slots = [
    { index: prevIdx, position: "top" },
    { index: activeIndex, position: "middle" },
    { index: nextIdx, position: "bottom" },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-[clamp(3.5rem,8vh,6rem)]">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section title — centered, matching HowItWorks heading size */}
        <h2 className="mx-auto max-w-5xl text-center text-2xl sm:text-4xl font-black tracking-[-0.05em] text-[#080d63] lg:text-[4.2rem] lg:leading-[1.05] mb-8 sm:mb-12">
          What People Says
        </h2>

        {/* Main content grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[22vw_1fr] gap-6 lg:gap-10 xl:gap-14"
          onMouseEnter={() => {
            isHoveringRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveringRef.current = false;
          }}
        >
          {/* ── Left: fixed-height vertical reviewer selector ── */}
          <div
            ref={leftPanelRef}
            className="relative flex flex-row lg:flex-col items-center justify-center lg:h-[32vh] select-none"
          >
            {/* Vertical connecting line (desktop) */}
            <div className="hidden lg:block absolute left-[2.25rem] top-[1.5rem] bottom-[1.5rem] w-px bg-gradient-to-b from-[#e4e4e7] via-[#cdcdd4] to-[#e4e4e7]" />
            {/* Horizontal connecting line (mobile) */}
            <div className="lg:hidden absolute top-[2.125rem] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#d4d4d8] to-transparent" />

            {slots.map(({ index, position }) => {
              const item = items[index];
              const isActive = position === "middle";
              const positionMotion =
                position === "top"
                  ? "lg:-translate-y-8 lg:scale-[0.92]"
                  : position === "bottom"
                    ? "lg:translate-y-8 lg:scale-[0.92]"
                    : "lg:translate-y-0 lg:scale-100";

              return (
                <button
                  key={`${index}-${position}`}
                  onClick={() => {
                    if (position === "top") goPrev();
                    else if (position === "bottom") goNext();
                  }}
                  className={`relative z-10 flex items-center gap-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] w-full ${positionMotion}
                    ${position === "middle"
                      ? "lg:my-5 lg:flex-1 cursor-default"
                      : "lg:my-0 cursor-pointer"
                    }
                    ${isActive ? "opacity-100" : "opacity-30 hover:opacity-55"}
                  `}
                >
                  {/* Logo circle */}
                  <div
                    className={`relative shrink-0 rounded-full bg-white overflow-hidden flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                      ${isActive
                        ? "w-[5.5rem] h-[5.5rem] border-2 border-[#0d1364] shadow-[0_8px_24px_rgba(13,19,100,0.14)]"
                        : "w-[3.25rem] h-[3.25rem] border border-[#d4d4d8]"
                      }
                    `}
                  >
                    <div
                      className={`relative transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? "w-[3.75rem] h-[3.75rem]" : "w-[2.125rem] h-[2.125rem]"} ${item.logoClassName ?? ""}`}
                    >
                      <Image
                        src={item.logo || item.image || "/logo.png"}
                        alt={item.author}
                        fill
                        sizes={isActive ? "60px" : "34px"}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Name & role */}
                  <div className={`text-left transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] min-w-0 ${isActive ? "" : "hidden sm:block"}`}>
                    <p
                      className={`font-bold text-[#0d1364] leading-tight transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                        ${isActive ? "text-[0.9375rem] sm:text-lg" : "text-xs"}
                      `}
                    >
                      {item.author}
                    </p>
                    {item.role && (
                      <p
                        className={`text-black/40 leading-snug mt-0.5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                          ${isActive ? "text-xs sm:text-[0.8125rem]" : "text-[0.625rem]"}
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
            <div className="hidden lg:flex absolute -bottom-7 left-0 right-0 items-center justify-center gap-1.5 text-[0.625rem] text-black/25 font-medium tracking-wide">
              <svg className="w-3 h-3 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              scroll to navigate
            </div>
          </div>

          {/* ── Right: testimonial text ── */}
          <div className="relative flex items-start lg:h-[36vh] lg:max-h-[36vh]">
            {/* Large quotation marks */}
            <span className="select-none text-[4rem] sm:text-[5rem] leading-none font-serif text-black -mt-2 sm:-mt-3 mr-1 sm:mr-3 shrink-0">
              &ldquo;
            </span>

            {/* Testimonial content */}
            <div className={`pt-3 sm:pt-5 flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${textMotion}`}>
              <p className={`text-sm sm:text-[0.9375rem] font-normal italic leading-[1.75] sm:leading-[1.85] text-[#444] max-w-xl text-justify ${textScaleClass}`}>
                {activeItem.text}
              </p>

              <span className="mt-2 sm:mt-3 self-end text-[4rem] sm:text-[5rem] leading-none font-serif text-black">
                &rdquo;
              </span>

              {/* Author (mobile only — desktop shows on left) */}
              <div className="mt-5 lg:hidden">
                <p className="font-bold text-[#0d1364] text-sm">{activeItem.author}</p>
                {activeItem.role && (
                  <p className="text-[0.6875rem] text-black/40 mt-0.5">{activeItem.role}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
