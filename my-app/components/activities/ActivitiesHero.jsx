'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ActivitiesHero({ data }) {
  return (
    <section className="relative overflow-hidden bg-transparent pt-28 pb-40 sm:pt-32 lg:pb-48">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-[760px] lg:mx-0 lg:translate-y-26"
        >
          <div className="relative overflow-hidden bg-transparent">
            <div className="relative aspect-[850/582] w-full">
              <Image
                src="/images/reference/Activities_hero.png"
                alt="Activities hero illustration"
                fill
                priority
                className="object-contain bg-transparent"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, y: 12 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.08 }}
          className="mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end "
        >
          <div className="text-center lg:text-center lg:translate-y-15">
            <span className="mb-4 bg-black/13 p-2 rounded-2xl inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#737373]">
              Activities
            </span>
            <h1 className="mx-auto max-w-lg text-4xl font-bold tracking-tight text-[#010268] sm:text-5xl md:text-6xl">
              {data.title}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-[#111827]/85 sm:text-base">
              {data.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}