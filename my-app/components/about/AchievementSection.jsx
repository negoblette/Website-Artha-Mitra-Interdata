'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AchievementSection({ data }) {
  const [flippedCards, setFlippedCards] = useState({});
  const [startIndex, setStartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [isSliding, setIsSliding] = useState(false);

  const images = data.images || [];
  const totalCards = images.length;
  const visibleCount = Math.min(3, totalCards || 0);

  const visibleIndices = Array.from({ length: visibleCount }, (_, offset) =>
    (startIndex + offset) % totalCards
  );

  const toggleFlip = (index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const goPrev = () => {
    if (totalCards <= visibleCount || isSliding) return;
    setSlideDirection('prev');
    setIsSliding(true);
    setStartIndex((prev) => (prev - visibleCount + totalCards) % totalCards);
    window.setTimeout(() => {
      setIsSliding(false);
      setSlideDirection('');
    }, 420);
  };

  const goNext = () => {
    if (totalCards <= visibleCount || isSliding) return;
    setSlideDirection('next');
    setIsSliding(true);
    setStartIndex((prev) => (prev + visibleCount) % totalCards);
    window.setTimeout(() => {
      setIsSliding(false);
      setSlideDirection('');
    }, 420);
  };

  return (
    <section className="relative flex min-h-screen items-center bg-transparent py-16">
      <div className="mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={totalCards <= visibleCount || isSliding}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0a0b85] text-[#0a0b85] transition-colors hover:bg-[#0a0b85] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous achievements"
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-4xl font-black uppercase text-[#0a0b85] md:text-6xl">Our Achievement</h2>

          <button
            type="button"
            onClick={goNext}
            disabled={totalCards <= visibleCount || isSliding}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0a0b85] text-[#0a0b85] transition-colors hover:bg-[#0a0b85] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next achievements"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div
          className={`achievement-track mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3 ${
            isSliding ? (slideDirection === 'next' ? 'achievement-track-slide-next' : 'achievement-track-slide-prev') : ''
          }`}
        >
          {visibleIndices.map((cardIndex) => (
            <button
              key={`achievement-${cardIndex}`}
              type="button"
              onClick={() => toggleFlip(cardIndex)}
              className="group h-56 w-full text-left [perspective:1200px]"
              aria-pressed={Boolean(flippedCards[cardIndex])}
              aria-label={`Flip achievement card ${cardIndex + 1}`}
            >
              <span className="sr-only">Flip card</span>
              <div
                className={`relative h-full rounded-xl [transform-style:preserve-3d] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateY(180deg)] ${flippedCards[cardIndex] ? '[transform:rotateY(180deg)]' : ''}`}
              >
                <div className="absolute inset-0 overflow-hidden rounded-xl bg-[#0a0b85] text-white shadow-[0_12px_24px_rgba(10,11,133,0.22)] [backface-visibility:hidden]">
                  <img
                    src={images[cardIndex]}
                    alt={`Achievement ${cardIndex + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#0a0b85]/68 via-[#0a0b85]/25 to-transparent" />
                  <span className="absolute right-4 top-3 text-xl leading-none">&rarr;</span>
                  <span className="absolute bottom-4 left-4 text-sm font-semibold tracking-[0.16em] text-white/95">ACHIEVEMENT</span>
                </div>

                <div className="absolute inset-0 rounded-xl border border-[#0a0b85]/35 bg-white p-5 text-[#111827] shadow-[0_12px_24px_rgba(10,11,133,0.16)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0a0b85]/75">Achievement</span>
                  <span className="mt-3 block text-3xl font-black leading-none text-[#0a0b85]">Card {cardIndex + 1}</span>
                  <span className="mt-4 block text-sm leading-relaxed text-[#111827]/85">
                    Pencapaian tim AMI dalam menghadirkan solusi IT yang terukur dan berkelanjutan.
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
