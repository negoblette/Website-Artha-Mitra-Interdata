'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

export default function PrincipalLogos({ data }) {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-[#ffffff]" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-10">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
              Our Principals
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {data.map((logo, i) => (
              <motion.div
                key={`${logo.name}-${i}`}
                whileHover={{ scale: 1.08, y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-[#f3f4f6] rounded-xl px-8 py-4 flex items-center justify-center shadow-lg shadow-gray-300/20 hover:shadow-xl hover:shadow-gray-300/30 transition-shadow cursor-pointer"
              >
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={130}
                  height={44}
                  className="h-9 w-auto object-contain"
                />
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

