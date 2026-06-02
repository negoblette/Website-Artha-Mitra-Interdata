'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ─── icon map by milestone title keyword ─── */
function getMilestoneIcon(title) {
  const t = title.toLowerCase();
  if (t.includes('founded'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-6h6v6" /><path d="M9 9h.01" /><path d="M15 9h.01" /><path d="M9 13h.01" /><path d="M15 13h.01" />
      </svg>
    );
  if (t.includes('operations') || t.includes('commenced'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  if (t.includes('relocation'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    );
  if (t.includes('renovation'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    );
  if (t.includes('compliance') || t.includes('audit'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    );
  if (t.includes('iso') || t.includes('certification'))
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 15l-2 5l1.5-.5L12 22l.5-2.5L14 20l-2-5z" /><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /><circle cx="12" cy="8" r="7" />
        <path d="M15 8l-3 3-2-2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  );
}

export default function HistorySection({ data }) {
  const [activeIndex, setActiveIndex] = useState(data.milestones.length - 1);
  const [direction, setDirection] = useState(0); // -1 left, 1 right
  const [isAnimating, setIsAnimating] = useState(false);
  const timelineRef = useRef(null);
  const activeBtnRef = useRef(null);

  const milestone = data.milestones[activeIndex];
  const pauseRef = useRef(false);
  const pauseTimerRef = useRef(null);

  const goTo = useCallback(
    (idx) => {
      if (idx === activeIndex || isAnimating) return;
      setDirection(idx > activeIndex ? 1 : -1);
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex(idx);
        setIsAnimating(false);
      }, 280);
    },
    [activeIndex, isAnimating]
  );

  /* manual click pauses auto-play briefly then resumes */
  const handleSelect = useCallback(
    (idx) => {
      goTo(idx);
      pauseRef.current = true;
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => {
        pauseRef.current = false;
      }, 6000);
    },
    [goTo]
  );

  /* auto-advance every 4 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      if (pauseRef.current || isAnimating) return;
      setDirection(1);
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) =>
          prev >= data.milestones.length - 1 ? 0 : prev + 1
        );
        setIsAnimating(false);
      }, 280);
    }, 4000);
    return () => clearInterval(interval);
  }, [data.milestones.length, isAnimating]);

  /* scroll the timeline so the active marker stays centered on mobile */
  useEffect(() => {
    if (activeBtnRef.current && timelineRef.current) {
      const container = timelineRef.current;
      const btn = activeBtnRef.current;
      const scrollLeft = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeIndex]);

  const contentStyle = isAnimating
    ? {
        opacity: 0,
        transform: `translateX(${direction * 40}px)`,
        transition: 'opacity 280ms ease, transform 280ms ease',
      }
    : {
        opacity: 1,
        transform: 'translateX(0)',
        transition: 'opacity 380ms ease, transform 380ms ease',
      };

  return (
    <section id="history" className="relative isolate bg-transparent py-[clamp(3.5rem,8vh,6rem)]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* ── Section header ── */}
        <div className="history-intro mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black text-[rgba(13,27,94)] md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed font-semibold text-black md:text-base">
            AMI's journey is built on long-term commitment, strong collaboration, and a focus on measurable results.
          </p>
        </div>

        {/* ── Content card ── */}
        <div className="mx-auto mt-10 max-w-4xl">
          <div
            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_8px_40px_rgba(10,11,133,0.08)]"
            style={{ minHeight: '240px' }}
          >
            <div className="flex flex-col md:flex-row items-stretch" style={contentStyle}>
              {/* Icon / visual panel */}
              <div className="flex items-center justify-center bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] px-8 py-8 md:w-[200px] md:min-h-[240px] shrink-0">
                <div className="flex flex-col items-center gap-3 text-white">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
                    {getMilestoneIcon(milestone.title)}
                  </div>
                  <span className="text-xs font-medium tracking-widest uppercase opacity-70">
                    {milestone.year}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="flex flex-col justify-center px-8 py-8 md:px-10 md:py-10">
                <span className="text-sm font-bold tracking-wider text-[rgb(20,40,120)] uppercase">
                  {milestone.year}
                </span>
                <h3 className="mt-2 text-2xl font-black text-gray-900 md:text-3xl leading-tight">
                  {milestone.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 font-medium md:text-base max-w-lg">
                  {milestone.detail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Horizontal timeline ── */}
        <div className="mx-auto mt-10 max-w-4xl">
          <div
            ref={timelineRef}
            className="relative flex items-center overflow-x-auto no-scrollbar px-2 py-4"
          >
            {/* The connecting line */}
            <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-gray-200 -translate-y-1/2 pointer-events-none" />

            <div className="relative flex items-center w-full justify-between min-w-[600px]">
              {data.milestones.map((m, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={`${m.year}-${i}`}
                    ref={isActive ? activeBtnRef : null}
                    onClick={() => handleSelect(i)}
                    className="group relative flex flex-col items-center focus:outline-none z-10"
                    aria-label={`View milestone ${m.year}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {/* Dot */}
                    <div
                      className={`
                        relative flex items-center justify-center rounded-full transition-all duration-300
                        ${isActive
                          ? 'w-5 h-5 bg-[rgb(20,40,120)] ring-4 ring-[rgba(20,40,120,0.18)] shadow-[0_0_12px_rgba(20,40,120,0.35)]'
                          : 'w-3 h-3 bg-gray-300 group-hover:bg-[rgb(20,40,120)] group-hover:scale-125'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Year label */}
                    <span
                      className={`
                        mt-3 text-xs font-bold transition-colors duration-300 whitespace-nowrap
                        ${isActive
                          ? 'text-[rgb(20,40,120)]'
                          : 'text-gray-400 group-hover:text-gray-700'
                        }
                      `}
                    >
                      {m.year}
                    </span>

                    {/* Active indicator triangle */}
                    {isActive && (
                      <div className="absolute -top-2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-[rgb(20,40,120)] opacity-60" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>



        {/* ── Footer text ── */}
        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-sm leading-relaxed font-semibold text-black md:text-base">
            We continue to grow with customers as a consistent, adaptive technology partner focused on business impact.
          </p>
        </div>
      </div>
    </section>
  );
}
