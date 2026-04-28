'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

export default function ActivitiesHero({ data }) {
  return (
    <section className="relative min-h-[460px] overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36">
    <div className="absolute inset-0 bg-white" />

      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-[24%] right-[-4rem] [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.04)_28%,rgba(0,0,0,0.42)_44%,rgba(0,0,0,0.88)_58%,#000_68%)] [-webkit-mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.04)_28%,rgba(0,0,0,0.42)_44%,rgba(0,0,0,0.88)_58%,#000_68%)] sm:left-[28%] sm:right-[-5rem] lg:left-[34%] lg:right-[-6rem]">
          <Image
            src="/images/activities.jpeg"
            alt="Activities hero background"
            fill
            priority
            sizes="(min-width: 1024px) 66vw, (min-width: 640px) 72vw, 78vw"
            className="object-cover object-right"
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(250,251,254,0.995)_34%,rgba(243,245,250,0.96)_46%,rgba(238,241,248,0.88)_56%,rgba(255,255,255,0.28)_74%,rgba(255,255,255,0.08)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(255,65,65,0.18),transparent_20%),radial-gradient(circle_at_72%_28%,rgba(5,128,255,0.10),transparent_18%)]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-10" />
      <div className="absolute inset-0 grid-pattern opacity-[0.035]" />

      <motion.div
        className="absolute top-24 left-8 h-72 w-72 rounded-full bg-[#ff5d2b]/[0.12] blur-[130px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.28, 0.5, 0.28] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#9c1b59]/[0.14] blur-[140px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.58, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex min-h-[430px] w-full max-w-[1600px] items-center px-4 sm:px-6 lg:px-20">
        <div className="max-w-3xl">
          <AnimatedSection>
            <h1 className="text-5xl font-black tracking-tight text-[#0a0b85] sm:text-6xl lg:text-[5.4rem]">
              {data.title}
            </h1>

  
            <p className="mt-6 max-w-xl text-[16px] font-semibold leading-8 text-[#111827]/58 sm:text-[19px]">
              {data.description}
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
