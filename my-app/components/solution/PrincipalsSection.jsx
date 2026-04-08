'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

export default function PrincipalsSection({ data }) {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="text-center mb-14">
            <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Our Partners
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4">
              {data.title}
            </h2>
            <p className="text-[#111827] text-sm leading-relaxed max-w-2xl mx-auto">
              {data.description}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4">
            {data.logos.map((logo, i) => (
              <motion.div
                key={`${logo.name}-${i}`}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-[#f3f4f6] rounded-xl px-6 py-4 flex items-center justify-center shadow-lg shadow-gray-300/20 hover:shadow-xl hover:shadow-gray-300/30 transition-shadow"
              >
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

