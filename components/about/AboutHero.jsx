'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// jangan pake import Sora terus import sora terus berat Next.js ny...//

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

      <div className="relative z-10 mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center lg:text-left"
        >
          <h1 className="text-4xl font-black text-[rgb(13,27,94)] sm:text-5xl lg:text-[64px] lg:leading-[0.95]">
            {data.title}
          </h1>

          {/* ga usah make segala "font-[family-name:var(--font-sora)]" orang udah jadi global.css inefficient */}
          <p className="mx-auto mt-4 max-w-xl text-m font-semibold leading-relaxed text-black/80 lg:mx-0">
            Our core focus has never wavered since our establishment in what we have
            always trusted in the partnership approach of shared responsibility and
            vision. This is how we differ from other IT Solutions Integrator and
            Provider, we hold ourselves accountable to what we set out to achieve.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            <Link href="/contact" className="rounded-full border border-[rgb(13,27,94)] px-8 py-2.5 text-base font-semibold text-[rgb(13,27,94)] hover:bg-[rgb(13,27,94)] hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="#history" className="rounded-full border border-[rgb(13,27,94)] px-8 py-2.5 text-base font-semibold text-[rgb(13,27,94)] hover:bg-[rgb(13,27,94)] hover:text-white transition-colors">
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="rounded-2xl border border-[#b6c1ff] bg-gradient-to-br from-[#0b2c80] via-[#1f4ca8] to-[#72a3f5] p-1 shadow-[0_18px_44px_rgba(25,45,125,0.2)]"
        >
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
        </motion.div>

      </div>
    </section>
  );
}