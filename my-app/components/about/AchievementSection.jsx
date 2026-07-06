'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function AchievementSection({ data }) {
  const [cardRatio, setCardRatio] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [isSliding, setIsSliding] = useState(false);

  const referenceImage = '/images/Achievement/Juniper%202010.png';

  useEffect(() => {
    const img = new Image();
    img.src = referenceImage;
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      setCardRatio(img.naturalWidth / img.naturalHeight);
    };
  }, []);

  const images = data.images || [];
  const totalCards = images.length;
  const visibleCount = Math.min(3, totalCards || 0);

  const visibleIndices = Array.from({ length: visibleCount }, (_, offset) =>
    (startIndex + offset) % totalCards
  );

  const handleImageLoad = (src, event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    if (src === referenceImage) {
      setCardRatio(naturalWidth / naturalHeight);
    }
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
    <section className="relative isolate bg-transparent py-[clamp(3.5rem,8vh,6rem)]">
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

          <h2 className="text-4xl font-black text-[rgba(13,27,94))] md:text-5xl">Achievement</h2>

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
            <div
              key={`achievement-${cardIndex}`}
              className="group w-full text-left"
              style={{ aspectRatio: cardRatio || '16 / 9' }}
            >
              <div className="relative h-full overflow-hidden rounded-xl bg-[#0a0b85] text-white shadow-[0_12px_24px_rgba(10,11,133,0.22)] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_18px_32px_rgba(10,11,133,0.24)]">
                <Image
                  src={images[cardIndex]}
                  alt={`Achievement ${cardIndex + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                  onLoad={(event) => handleImageLoad(images[cardIndex], event)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
