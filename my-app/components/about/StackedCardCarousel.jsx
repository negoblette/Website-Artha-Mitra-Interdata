'use client';

import { useEffect, useState } from 'react';

export default function StackedCardCarousel({
  items = [],
  autoPlay = false,
  autoPlayDelay = 3000,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = items.length;

  const next = () => setActiveIndex((prev) => (prev + 1) % total);
  const prev = () => setActiveIndex((prev) => (prev - 1 + total) % total);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(next, autoPlayDelay);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay]);

  const getTransform = (offset) => {
    const spacing = 260; // jarak antar card
    const scaleStep = 0.15;

    const abs = Math.abs(offset);

    if (abs > 2) {
      return {
        transform: `translate(-50%, -50%) scale(0.6)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none',
      };
    }

    return {
      transform: `
        translate(-50%, -50%)
        translateX(${offset * spacing}px)
        scale(${1 - abs * scaleStep})
        rotateY(${offset * -8}deg)
      `,
      opacity: 1 - abs * 0.3,
      zIndex: 50 - abs * 10,
    };
  };

  return (
    <div className="relative h-[420px] w-full overflow-hidden">
      {items.map((item, index) => {
        let offset = index - activeIndex;

        // circular fix
        if (offset > total / 2) offset -= total;
        if (offset < -total / 2) offset += total;

        const style = getTransform(offset);

        return (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transition: 'transform 500ms ease, opacity 500ms ease',
              willChange: 'transform',
              ...style,
            }}
            className="w-[320px] h-[220px] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-700 to-blue-400"
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute bottom-4 left-4 text-white font-semibold">
              {item.title}
            </div>
          </div>
        );
      })}

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <button onClick={prev} className="px-3 py-1 bg-white/80 rounded-full">←</button>
        <button onClick={next} className="px-3 py-1 bg-white/80 rounded-full">→</button>
      </div>
    </div>
  );
}