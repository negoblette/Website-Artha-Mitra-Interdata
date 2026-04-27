'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CiptaValuesSection({ values = [] }) {
  if (!values.length) return null;

  return (
    <section className="relative overflow-hidden py-8 sm:py-12">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f6f8ff]/55 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-4xl font-black tracking-tight text-[rgba(13,27,94)] sm:text-5xl">
            Core Values
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-black sm:text-base">
            The principles that guide how we collaborate, deliver, and create lasting value for every client partnership.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
          {values.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group [perspective:1200px]"
            >
              <div className="relative h-44 rounded-xl [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
                <div
                  className={`absolute inset-0 overflow-hidden rounded-xl border border-[#e2e2e2] shadow-sm card-grad-${index} [backface-visibility:hidden]`}
                >
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(min-width: 768px) 20vw, 45vw"
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center text-7xl font-black tracking-wider text-white">
                    {card.letter}
                  </span>
                </div>

                <div className="absolute inset-0 rounded-xl border border-[#0a0b85]/25 bg-gradient-to-br from-[#05063f] via-[#090b66] to-[#020212] p-4 text-center shadow-[0_18px_40px_rgba(10,11,133,0.22)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex h-full flex-col items-center rounded-[0.85rem] border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-[2px]">
                    <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/65">
                      {card.title}
                    </span>
                    <p className="my-auto max-w-[25ch] text-[10px] leading-[1.4] text-white/82">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center font-bold text-black">{card.title}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
