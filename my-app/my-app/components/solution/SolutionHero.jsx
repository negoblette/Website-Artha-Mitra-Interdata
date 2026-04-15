'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SolutionHero({ data }) {
  return (
    <section className="relative overflow-hidden h-screen min-h-[700px] flex items-center bg-transparent">
      
      <motion.div
        className="absolute top-16 right-0 w-96 h-64 bg-[#010268]/[0.04] rounded-full blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-72 h-72 bg-[#737373]/8 rounded-full blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1"
        >
          <div className="rounded-2xl border border-[#b6c1ff] bg-gradient-to-br from-[#0b2c80] via-[#72a2f5] to-[#dbe8ff] p-1 shadow-[0_18px_44px_rgba(25,45,125,0.2)]">
            <div className="relative h-60 overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#dbe8ff,#eff5ff)] sm:h-72 lg:h-[340px]">
              {data.image ? (
                  <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    sizes="(min-width: 1024px) 54vw, 100vw"
                    className="object-cover object-center"
                    priority
                  />
                ) : null}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center lg:text-left order-1 lg:order-2"
        >
          <h1 className="text-4xl sm:text-5xl md:text-[64px] leading-[1.1] font-black text-[#111827] mb-3 tracking-tight">
            {data.title}
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-[#010268] mb-6">
            {data.subtitle}
          </h2>
          <p className="text-[#111827] text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
            {data.description}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
