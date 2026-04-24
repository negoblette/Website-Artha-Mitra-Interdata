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
          {/* <span className="inline-block mb-3 px-4 py-1 text-m font-semibold bg-[rgb(13,27,94)]/10 text-[rgb(13,27,94)] rounded-full">
            IT Solutions Integrator
          </span> */}

          <h1 className="text-5xl mt-15 font-extrabold text-[rgb(13,27,94)] sm:text-6xl lg:text-7xl xl:text-8xl lg:leading-[0.95]">
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
            <Link href="/contact" className="inline-flex min-w-44 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold hover:bg-[rgb(19,27,94)] hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link href="#history" className="inline-flex min-w-44 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold hover:bg-[rgb(19,27,94)] hover:text-white transition-colors">
              Learn More
            </Link>
          </motion.div>
          <div className="mt-15 bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] text-white p-8 rounded-2xl max-w-auto">
            <p className="text-xl font-semibold leading-relaxed">
              At Artha Mitra Interdata, we believe in a partnership approach built on shared responsibility and vision. We work closely with our customers to deliver infrastructure and security solutions that create real value, building IT environments that are efficient, resilient, and ready to support long-term growth.
            </p>
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