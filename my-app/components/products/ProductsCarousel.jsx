'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductsCarousel({ items = {} }) {
  const data = Array.isArray(items) ? { images: items } : items || {};
  const photos = data.images || [];

  const [trackIndex, setTrackIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const CARD_RATIO = 0.3;
  const GAP = 20;

  //  WIDTH
  useEffect(() => {
    if (!containerRef.current) return;

    const update = () => {
      setContainerWidth(containerRef.current.offsetWidth);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const cardWidth = containerWidth * CARD_RATIO;
  const step = cardWidth + GAP;

  //  LOOP DATA 
  const loopPhotos = useMemo(() => {
    if (photos.length < 3) return photos;

    return [
      photos[photos.length - 2],
      photos[photos.length - 1],
      ...photos,
      photos[0],
      photos[1],
    ];
  }, [photos]);

  //  INIT 
  useEffect(() => {
    if (!photos.length) return;

    const frame = requestAnimationFrame(() => {
      setIsAnimating(false);
      setTrackIndex(2);
    });

    return () => cancelAnimationFrame(frame);
  }, [photos.length]);

  //  AUTO SLIDE 
  useEffect(() => {
    if (!photos.length || isPaused) return;

    const timer = setInterval(() => {
      setTrackIndex((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, photos.length]);

  //  OFFSET 
  const offsetX = useMemo(() => {
    return containerWidth / 2 - cardWidth / 2 - trackIndex * step;
  }, [containerWidth, cardWidth, trackIndex, step]);

  //  LOOP FIX 
  const handleSlideComplete = () => {
    if (photos.length <= 1) return;

    // kanan (reset lebih cepat, hindari double)
    if (trackIndex === photos.length + 1) {
      setIsAnimating(false);
      setTrackIndex(2);
    }

    // kiri
    if (trackIndex === 1) {
      setIsAnimating(false);
      setTrackIndex(photos.length + 1);
    }
  };

  //  🔥 DOUBLE RAF FIX (smoothing transition)
  useEffect(() => {
    if (!isAnimating) {
      let raf1 = requestAnimationFrame(() => {
        let raf2 = requestAnimationFrame(() => {
          setIsAnimating(true);
        });
        return () => cancelAnimationFrame(raf2);
      });

      return () => cancelAnimationFrame(raf1);
    }
  }, [isAnimating]);

  //  ACTIVE DOT
  const activeRealIndex = photos.length
    ? (trackIndex - 2 + photos.length) % photos.length
    : 0;

  const goTo = (i) => {
    setIsAnimating(true);
    setTrackIndex(i + 2);
  };

  if (!photos.length) return null;

  //  RENDER 
  return (
    <section className="relative overflow-hidden bg-transparent py-10">
      <div className="absolute inset-0 pointer-events-none bg-[repeating-radial-gradient(ellipse_at_center,rgba(124,140,232,0.18)_0px,rgba(124,140,232,0.18)_2px,transparent_2px,transparent_24px)] opacity-30" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 text-center">
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden"
          style={{ height: 'clamp(130px, 16vw, 230px)' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            key={isAnimating ? 'animating' : 'static'}
            className="absolute top-0 flex items-center"
            style={{ gap: GAP, willChange: 'transform' }} // 🔥 GPU optimize
            animate={{ x: offsetX }}
            transition={
              isAnimating
                ? { duration: 0.7, ease: [0.33, 1, 0.68, 1] }
                : { duration: 0 }
            }
            onAnimationComplete={handleSlideComplete}
          >
            {loopPhotos.map((src, i) => {
              const isActive = i === trackIndex;

              return (
                <motion.div
                  key={i}
                  animate={{
                    scale: isActive ? 1 : 0.82,
                    opacity: isActive ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.4 }}
                  className="relative flex-shrink-0 overflow-hidden rounded-2xl cursor-pointer"
                  style={{
                    width: cardWidth,
                    height: isActive
                      ? 'clamp(130px, 16vw, 230px)'
                      : 'clamp(100px, 12vw, 180px)',
                    transition:
                      'height 0.4s cubic-bezier(0.22,1,0.36,1)',
                    border: isActive
                      ? '2px solid rgba(10,11,133,0.4)'
                      : '1px solid #c9d2ff',
                    boxShadow: isActive
                      ? '0 16px 40px rgba(10,11,133,0.28)'
                      : '0 8px 20px rgba(10,11,133,0.14)',
                    zIndex: isActive ? 10 : 1,
                  }}
                  onClick={() =>
                    goTo((i - 2 + photos.length) % photos.length)
                  }
                >
                  <Image
                    src={src}
                    alt={`Image ${i}`}
                    fill
                    sizes="55vw"
                    className="object-cover"
                    priority={i <= 2}
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent ${
                      isActive ? 'opacity-50' : 'opacity-70'
                    }`}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* DOTS */}
        <div className="mt-8 flex justify-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                activeRealIndex === i
                  ? 'h-1.5 w-7 bg-[#0a0b85]'
                  : 'h-1.5 w-2.5 bg-[#0a0b85]/35 hover:bg-[#0a0b85]/55'
              }`}
            />
          ))}
        </div>

        {data.description && (
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-black/80 md:text-base">
            {data.description}
          </p>
        )}
      </div>
    </section>
  );
}