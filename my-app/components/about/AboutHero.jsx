'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// jangan pake import Sora terus berat Next.js ny...//

export default function AboutHero({ data }) {
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

      <div className="relative z-10 mx-30 grid h-full w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px] grid-cols-1 items-center gap-5 lg:gap-6 xl:gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr]">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center lg:text-left"
        >
          {/* <span className="inline-block mb-3 px-4 py-1 text-m font-semibold bg-[rgb(13,27,94)]/10 text-[rgb(13,27,94)] rounded-full">
            IT Solutions Integrator
          </span> */}

          <h1 className="text-5xl mt-15 font-black text-[rgb(13,27,94)] sm:text-6xl lg:text-7xl xl:text-8xl lg:leading-[0.95]">
            {data.title}
          </h1>

          {/* ga usah make segala "font-[family-name:var(--font-sora)]" orang udah jadi global.css inefficient */}
          {/* <p className="mt-4 max-w-2xl font-semibold text-m text-black lg:mx-0">
            Delivering reliable IT solutions through strong partnerships and innovation.
          </p> */}

          <ul className="mt-4 font-semibold space-y-2 text-xl text-[rgb(13,27,94)]">
            <li>• Trusted IT Solutions Integrator</li>
            <li>• Scalable digital infrastructure</li>
            <li>• Long-term partnership focused</li>
          </ul>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            <Link href="/contact" className="rounded-full border border-[rgb(13,27,94)] px-8 py-2.5 text-base font-semibold text-[rgb(13,27,94)] hover:bg-[rgb(13,27,94)] hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="#history" className="rounded-full border border-[rgb(13,27,94)] px-8 py-2.5 text-base font-semibold text-[rgb(13,27,94)] hover:bg-[rgb(13,27,94)] hover:text-white transition-colors">
              Learn More
            </Link>
          </motion.div>
          <div className="mt-10 bg-[rgb(13,27,94)] text-white p-8 rounded-2xl max-w-xl">
            <p className="text-m font-semibold leading-relaxed">
              We believe in the power of collaboration and innovation. By partnering closely with our clients, we deliver solutions that truly make a difference.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="relative"
        >
          <div className="p-2 bg-white rounded-[32px] shadow-[0_20px_60px_rgba(13,27,94,0.2)] lg:translate-y-6 xl:translate-y-10">
            <div
              className="relative h-60 overflow-hidden sm:h-72 lg:h-[520px] rounded-[20px]"
            >
              {data.image ? (
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="object-cover object-center"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-[#0a0b85]">SOLUSI IT TERPADU</p>
                    <p className="mt-3 text-3xl font-black text-[#0a0b85]">AMI</p>
                    <p className="mt-2 text-sm font-semibold text-[#0a0b85]/80">Your Technology Partner</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}