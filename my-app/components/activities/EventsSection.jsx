'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mountain } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function EventCard({ event, index, flippedCards, toggleFlip }) {
  const isFlipped = Boolean(flippedCards[index]);
  const hasImage = typeof event.image === 'string' && event.image.trim().length > 0;

  return (
    <AnimatedSection delay={index * 0.1}>
      <motion.article
        layout
        className="group h-full w-full text-left [perspective:1600px]"
      >
        <div
          className={`relative min-h-[520px] rounded-[1.85rem] [transform-style:preserve-3d] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[1.85rem] border border-white/65 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-sm [backface-visibility:hidden]">
            <div className="relative flex h-52 w-full items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#eef4ff_0%,#d8e4ff_46%,#f7faff_100%)]">
              {hasImage ? (
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#eef4ff_0%,#d8e4ff_46%,#f7faff_100%)]">
                  <Mountain className="text-[#0a0b85] transition-transform duration-500 group-hover:scale-110" size={30} />
                </div>
              )}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(10,11,133,0.10),transparent_28%),linear-gradient(135deg,rgba(10,11,133,0.06),transparent_58%)]" />
              <div className="absolute left-5 top-5 rounded-full border border-white/75 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0a0b85] shadow-[0_10px_20px_rgba(10,11,133,0.08)] backdrop-blur-sm">
                Event
              </div>
              <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#0a0b85]/10 blur-3xl" />
              <div className="absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-white/40 blur-2xl" />
              {!hasImage && (
                <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.45rem] border border-white/75 bg-white/90 shadow-[0_18px_40px_rgba(10,11,133,0.14)] ring-1 ring-[#0a0b85]/5">
                  <Mountain className="text-[#0a0b85] transition-transform duration-500 group-hover:scale-110" size={30} />
                </div>
              )}
            </div>

            <div className="relative flex min-h-[258px] flex-col p-5 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(10,11,133,0.22),transparent)]" />
              <span className="inline-flex w-fit rounded-full border border-[#0a0b85]/10 bg-[#eef3ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0a0b85] shadow-[0_8px_18px_rgba(10,11,133,0.06)]">
                {event.category}
              </span>
              <h4 className="mt-3 text-[1.02rem] font-bold tracking-tight text-[#111827] transition-colors group-hover:text-[#0a0b85]">
                {event.name}
              </h4>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-[#526076]">
                {event.description}
              </p>
              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => toggleFlip(index)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a0b85] transition-colors hover:text-[#111827]"
                  aria-pressed={isFlipped}
                  aria-label={isFlipped ? `Show front of ${event.name}` : `Flip ${event.name} card`}
                >
                  {isFlipped ? 'Show front' : 'Flip card'}
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 overflow-hidden rounded-[1.85rem] border border-[#0a0b85]/15 bg-[linear-gradient(135deg,#0a0b85_0%,#0f1aa8_45%,#111827_100%)] p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <div className="flex h-full flex-col">
              <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/90">
                Event Details
              </span>

              <h4 className="mt-4 text-2xl font-bold tracking-tight">
                {event.name}
              </h4>

              <p className="mt-4 text-sm leading-5 text-white/80">
                {event.description}
              </p>

              <div className="mt-15 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                  Category
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {event.category}
                </p>
                <p className="mt-[1] text-sm leading-6 text-white/75">
                  Use the button below to return to the front side.
                </p>

                <button
                  type="button"
                  onClick={() => toggleFlip(index)}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                  aria-pressed={isFlipped}
                  aria-label={isFlipped ? `Show front of ${event.name}` : `Flip ${event.name} card`}
                >
                  {isFlipped ? 'Show front' : 'Flip card'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </AnimatedSection>
  );
}

export default function EventsSection({ data }) {
  const [flippedCards, setFlippedCards] = useState({});
  const [startIndex, setStartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [isSliding, setIsSliding] = useState(false);

  const events = data?.items || [];
  const totalCards = events.length;
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
    <section className="relative py-28">
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-20" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <AnimatedSection>
          <div className="mb-14 max-w-2xl">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#737373]">
              Events
            </span>
            <h2 className="gradient-text mb-2 inline-block text-3xl font-bold tracking-tight sm:text-4xl">
              {data?.title}
            </h2>
            <p className="text-sm leading-7 text-[#475569]">{data?.subtitle}</p>
          </div>
        </AnimatedSection>

        <div className="mx-auto mb-6 flex max-w-5xl items-center justify-end gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={totalCards <= visibleCount || isSliding}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0a0b85] text-[#0a0b85] transition-colors hover:bg-[#0a0b85] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous events"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={totalCards <= visibleCount || isSliding}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0a0b85] text-[#0a0b85] transition-colors hover:bg-[#0a0b85] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next events"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div
          className={`achievement-track mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3 ${
            isSliding
              ? slideDirection === 'next'
                ? 'achievement-track-slide-next'
                : 'achievement-track-slide-prev'
              : ''
          }`}
        >
          {visibleIndices.map((cardIndex) => {
            const event = events[cardIndex];

            return (
              <EventCard
                key={`${event.name}-${cardIndex}`}
                event={event}
                index={cardIndex}
                flippedCards={flippedCards}
                toggleFlip={toggleFlip}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
