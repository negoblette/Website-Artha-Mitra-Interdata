'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LifeAtAmi({ data }) {
  const photos = data.images || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const getWrappedIndex = (index) => {
    if (!photos.length) return 0;
    return (index + photos.length) % photos.length;
  };

  const stripSlots = [
    { offset: -2, x: '-112%', scale: 0.9, zIndex: 1, opacity: 0.76 },
    { offset: -1, x: '-65%', scale: 0.99, zIndex: 2, opacity: 0.9 },
    { offset: 0, x: '0%', scale: 1.12, zIndex: 5, opacity: 1 },
    { offset: 1, x: '65%', scale: 0.99, zIndex: 2, opacity: 0.9 },
    { offset: 2, x: '112%', scale: 0.9, zIndex: 1, opacity: 0.76 },
  ];

  useEffect(() => {
    if (photos.length <= 1) return;

    const timerId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 2600);

    return () => window.clearInterval(timerId);
  }, [photos.length]);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-transparent py-16">
      <img
        src="decor/lifeatamielements.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[-rem] h-full w-full object-cover opacity-100"
      />
      <div className="absolute left-0 right-0 top-8 h-56 bg-[repeating-radial-gradient(ellipse_at_center,rgba(124,140,232,0.22)_0px,rgba(124,140,232,0.22)_2px,transparent_2px,transparent_24px)] opacity-35" />
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-[repeating-radial-gradient(ellipse_at_center,rgba(124,140,232,0.3)_0px,rgba(124,140,232,0.3)_2px,transparent_2px,transparent_24px)] opacity-35" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
        <h2 className="text-5xl font-black text-[#0a0b85] md:text-6xl">{data.title}</h2>

        <div className="mx-auto mt-8 w-full max-w-[1320px] overflow-visible">
          <div className="relative mx-auto h-[210px] w-[118%] max-w-[1320px] -translate-x-[9%] sm:h-[238px] lg:h-[260px]">
            {stripSlots.map((slot, slotIndex) => {
              const photoIndex = getWrappedIndex(activeIndex + slot.offset);
              const isActive = slot.offset === 0;

              return (
                <button
                  key={`${photoIndex}-${slotIndex}`}
                  type="button"
                  onClick={() => setActiveIndex(photoIndex)}
                  className="absolute left-1/2 top-1/2 overflow-hidden rounded-xl border border-[#c9d2ff] bg-[#dfe6ff] shadow-[0_10px_22px_rgba(10,11,133,0.16)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: 'clamp(220px, 28vw, 400px)',
                    height: 'clamp(124px, 15vw, 210px)',
                    transform: `translate(-50%, -50%) translateX(${slot.x}) scale(${slot.scale})`,
                    zIndex: slot.zIndex,
                    opacity: slot.opacity,
                  }}
                  aria-label={`Select life image ${photoIndex + 1}`}
                  aria-current={isActive}
                >
                  <Image
                    src={photos[photoIndex]}
                    alt={`${data.title} ${photoIndex + 1}`}
                    fill
                    sizes="(min-width: 1024px) 24vw, 44vw"
                    className={`object-cover transition-transform duration-700 ${isActive ? 'scale-100' : 'scale-105'}`}
                    priority={photoIndex === 0}
                  />
                  <span className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-72' : 'opacity-42'}`} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-300 ${activeIndex === i ? 'h-2.5 w-7 bg-[#0a0b85]' : 'h-2.5 w-2.5 bg-[#0a0b85]/35 hover:bg-[#0a0b85]/55'}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={activeIndex === i}
            />
          ))}
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-sm leading-relaxed text-black/80 md:text-base">{data.description}</p>
      </div>
    </section>
  );
}
