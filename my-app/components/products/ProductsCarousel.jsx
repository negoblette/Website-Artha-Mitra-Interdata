'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductsCarousel({ items = {} }) {
  const data = Array.isArray(items) ? { images: items } : items || {};
  const photos = data.images || [];
  const [activeIndex, setActiveIndex] = useState(0);

  const getWrappedIndex = (index) => {
    if (!photos.length) return 0;
    return (index + photos.length) % photos.length;
  };

  const stripSlots = [
    { offset: -2, x: '-94%', scale: 0.8, zIndex: 1, opacity: 0.76 },
    { offset: -1, x: '-48%', scale: 0.9, zIndex: 2, opacity: 0.88 },
    { offset: 0, x: '0%', scale: 1, zIndex: 5, opacity: 1 },
    { offset: 1, x: '48%', scale: 0.9, zIndex: 2, opacity: 0.88 },
    { offset: 2, x: '94%', scale: 0.8, zIndex: 1, opacity: 0.76 },
  ];

  useEffect(() => {
    if (photos.length <= 1) return;

    const timerId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 3000);

    return () => window.clearInterval(timerId);
  }, [photos.length]);

  useEffect(() => {
    if (!photos.length) return;
    photos.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [photos]);

  return (
    <section className="relative flex items-center overflow-hidden bg-transparent py-6">
      <div className="absolute left-0 right-0 top-8 h-56 bg-[repeating-radial-gradient(ellipse_at_center,rgba(124,140,232,0.22)_0px,rgba(124,140,232,0.22)_2px,transparent_2px,transparent_24px)] opacity-35" />
      <div className="absolute left-0 right-0 bottom-0 h-56 bg-[repeating-radial-gradient(ellipse_at_center,rgba(124,140,232,0.3)_0px,rgba(124,140,232,0.3)_2px,transparent_2px,transparent_24px)] opacity-35" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
        {/* <h2 className="text-5xl font-black text-[#0a0b85] md:text-6xl">{data.title}</h2> */}

        {/* ga usah make title jadi terlalu cluttered */}

        <div className="mx-auto mt-8 w-full max-w-[1120px] overflow-hidden">
          <div className="relative mx-auto h-[32vh] w-full sm:h-[24vh]">
            {photos.length ? stripSlots.map((slot, slotIndex) => {
              const photoIndex = getWrappedIndex(activeIndex + slot.offset);
              const isActive = slot.offset === 0;

              return (
                <div key={`${photoIndex}-${slotIndex}`} className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
                  <motion.button
                    type="button"
                    onClick={() => setActiveIndex(photoIndex)}
                    initial={false}
                    animate={{ x: slot.x, scale: slot.scale, opacity: slot.opacity }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    className="relative overflow-hidden rounded-xl border border-[#c9d2ff] bg-[#dfe6ff] shadow-[0_10px_22px_rgba(10,11,133,0.16)] transform-gpu"
                    style={{
                      width: 'clamp(180px, 24vw, 340px)',
                      height: 'clamp(96px, 11vw, 170px)',
                      willChange: 'transform, opacity',
                      zIndex: slot.zIndex,
                    }}
                    aria-label={`Select life image ${photoIndex + 1}`}
                    aria-current={isActive}
                  >
                    <Image
                      src={photos[photoIndex]}
                      alt={`${data.title} ${photoIndex + 1}`}
                      fill
                      sizes="(min-width: 1024px) 24vw, 44vw"
                      className="object-cover"
                      priority={photoIndex === 0}
                    />
                    <span className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-72' : 'opacity-42'}`} />
                  </motion.button>
                </div>
              );
            }) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm font-black text-gray-500">No images available</p>
              </div>
            )}
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

