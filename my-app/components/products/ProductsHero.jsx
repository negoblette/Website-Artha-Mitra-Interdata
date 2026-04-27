'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProductsHero({ data }) {
  const title = 'Technology Partners';
  const description = 'Discover our world-class technology partners and the solutions they power.';

  return (
    <section className="relative min-h-[460px] overflow-hidden pb-28 pt-20 sm:pt-32 lg:pt-13">
      <div className="absolute inset-0 bg-white" />

      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-[24%] right-[-4rem] [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.04)_28%,rgba(0,0,0,0.42)_44%,rgba(0,0,0,0.88)_58%,#000_68%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.04)_28%,rgba(0,0,0,0.42)_44%,rgba(0,0,0,0.88)_58%,#000_68%)] sm:left-[28%] sm:right-[-5rem] lg:left-[34%] lg:right-[-10rem]">
          {data.image ? (
            <Image
              src={data.image}
              alt={data.title}
              fill
              priority
              sizes="(min-width: 1024px) 66vw, (min-width: 640px) 72vw, 78vw"
              className="object-cover object-right"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_28%,rgba(16,85,214,0.18),transparent_22%),radial-gradient(circle_at_76%_70%,rgba(3,7,92,0.16),transparent_24%),linear-gradient(135deg,rgba(243,247,255,0.1),rgba(213,225,255,0.55)_34%,rgba(189,204,255,0.18)_54%,rgba(255,255,255,0.03)_100%)]" />
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(250,251,254,0.995)_34%,rgba(243,245,250,0.96)_46%,rgba(238,241,248,0.88)_56%,rgba(255,255,255,0.28)_74%,rgba(255,255,255,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(5,128,255,0.08),transparent_22%),radial-gradient(circle_at_72%_28%,rgba(5,128,255,0.08),transparent_18%)]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-10" />
      <div className="absolute inset-0 grid-pattern opacity-[0.035]" />

      <motion.div
        className="absolute top-20 right-12 h-72 w-72 rounded-full bg-[#010268]/[0.05] blur-[100px]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-60 w-80 rounded-full bg-[#737373]/8 blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex min-h-[520px] w-full max-w-[1600px] items-center px-4 pt-23 sm:px-6 lg:px-40">
        <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="max-w-2xl text-5xl font-black leading-[0.94] text-[#0a0b85] sm:text-6xl lg:text-[5rem]">
            {data.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#111827]/88 sm:text-lg">
            {data.description}
          </p>
        </motion.div>
        </div>
      </div>
    </section>
  );
}