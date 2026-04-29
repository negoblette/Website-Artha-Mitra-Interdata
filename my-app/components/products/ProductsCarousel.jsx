'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ProductsCarousel({ items = {} }) {
  const data = Array.isArray(items) ? { images: items } : items || {};
  const logos = (data.images || []).map((item) =>
    typeof item === 'string'
      ? { name: '', logo: item }
      : { name: item.name || '', logo: item.logo || null },
  );

  if (!logos.length) return null;

  const loopedLogos = [...logos, ...logos];

  //  RENDER 
  return (
    <section className="relative overflow-hidden py-8 sm:py-2">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f6f8ff]/55 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1750px] px-4 sm:px-6 lg:px-40">
        {/* <div className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0a0b85]/50">
            Principal Network
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm font-medium leading-relaxed text-[#111827]/68">
            Trusted technology partners moving the solutions we deliver across infrastructure and security.
          </p>
        </div> */}

        <div className="relative overflow-hidden rounded-[2rem] border border-[#dce3f5] bg-white py-6 shadow-[0_18px_50px_rgba(10,11,133,0.06)] backdrop-blur-sm sm:py-7">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white via-white/92 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white via-white/92 to-transparent" />

          <motion.div
            className="flex w-max items-center gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
          >
            {loopedLogos.map((item, index) => (
              <div
                key={`${item.name || item.logo || 'principal'}-${index}`}
                className="relative flex h-20 w-[172px] shrink-0 items-center justify-center rounded-2xl bg-white/70 px-4 opacity-60 transition-opacity duration-300 hover:opacity-90"
              >
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.name || `Principal logo ${index + 1}`}
                    fill
                    sizes="172px"
                    className="object-contain px-5 grayscale"
                  />
                ) : (
                  <span className="text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-[#0a0b85]/65">
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
