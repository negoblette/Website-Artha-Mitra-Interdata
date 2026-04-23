'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutHero({ data }) {
  return (
    <section data-no-reveal="true" className="relative h-screen min-h-[700px] overflow-visible">
      <div className="relative mx-auto grid h-full w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-left"
        >
          <h1 className="text-4xl font-black text-[#0a0b85] sm:text-5xl lg:text-[64px] lg:leading-[0.95]">{data.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/80 lg:mx-0">
            Our core focus has never wavered since our establishment in what we have
            always trusted in the partnership approach of shared responsibility and
            vision. This is how we differ from other IT Solutions Integrator and
            Provider, we hold ourselves accountable to what we set out to achieve.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/contact" className="rounded-full border border-[#0a0b85] px-8 py-2.5 text-base font-semibold text-[#0a0b85] hover:bg-[#0a0b85] hover:text-white transition-colors">Contact Us</Link>
            <Link href="#history" className="rounded-full border border-[#0a0b85] px-8 py-2.5 text-base font-semibold text-[#0a0b85] hover:bg-[#0a0b85] hover:text-white transition-colors">Learn More</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
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