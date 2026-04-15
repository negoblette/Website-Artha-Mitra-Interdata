'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function SolutionDetailClient({ solution, allSolutions }) {
  const Icon = LucideIcons[solution.icon] || LucideIcons.Layers;
  const relatedSolutions = allSolutions
    .filter((s) => s.slug !== solution.slug)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />
        <div className="absolute inset-0 mesh-gradient-accent opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-10" />

        <motion.div
          className="absolute top-20 right-10 w-80 h-60 bg-[#010268]/8 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Link
              href="/solution"
              className="inline-flex items-center gap-2 text-sm text-[#111827] hover:text-[#111827] transition-colors mb-8"
            >
              <LucideIcons.ArrowLeft className="w-4 h-4" />
              Back to Solutions
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#010268]/16 to-[#737373]/10 border border-[#010268]/24 flex items-center justify-center">
                <Icon className="w-7 h-7 text-[#010268]" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111827] tracking-tight">
                {solution.name}
              </h1>
            </div>

            <p className="text-[#111827] text-base sm:text-lg leading-relaxed max-w-3xl">
              {solution.fullDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#ffffff]" />
        <div className="absolute inset-0 dot-pattern opacity-15" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="mb-10">
              <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                Key Features
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                What&apos;s Included
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {solution.features.map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card rounded-xl p-5 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#010268]/10 to-[#737373]/8 border border-[#010268]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <LucideIcons.Check className="w-4 h-4 text-[#010268]" />
                    </div>
                    <span className="text-[#111827] text-sm leading-relaxed group-hover:text-[#111827] transition-colors">
                      {feature}
                    </span>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners for this solution */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="mb-10">
              <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                Powered By
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                Technology Partners
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {solution.brands.map((brand, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.div
                    whileHover={{ y: -6, scale: 1.03 }}
                    transition={{ duration: 0.25 }}
                    className="glass-card-glow rounded-2xl p-6 text-center group"
                  >
                    <div className="bg-[#f3f4f6] rounded-xl p-4 mb-4 flex items-center justify-center h-16 group-hover:shadow-lg group-hover:shadow-gray-300/30 transition-shadow">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        width={140}
                        height={48}
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-[#111827] mb-2 group-hover:text-[#111827] transition-colors">
                      {brand.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#010268] group-hover:text-[#111827] transition-colors">
                      Visit Website
                      <LucideIcons.ExternalLink className="w-3 h-3" />
                    </div>
                  </motion.div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Related Solutions */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#ffffff]" />
        <div className="absolute inset-0 mesh-gradient-accent opacity-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="mb-10">
              <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                Explore More
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                Related Solutions
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedSolutions.map((sol, i) => {
              const SolIcon = LucideIcons[sol.icon] || LucideIcons.Layers;
              return (
                <AnimatedSection key={sol.slug} delay={i * 0.1}>
                  <Link href={`/solution/${sol.slug}`}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ duration: 0.25 }}
                      className="glass-card rounded-2xl p-5 group h-full"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#010268]/10 to-[#737373]/8 border border-[#010268]/15 flex items-center justify-center mb-3">
                        <SolIcon className="w-5 h-5 text-[#010268]" />
                      </div>
                      <h3 className="text-sm font-semibold text-[#111827] mb-1 group-hover:text-[#111827] transition-colors">
                        {sol.name}
                      </h3>
                      <p className="text-[#111827] text-xs leading-relaxed mb-3">
                        {sol.shortDescription}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-[#010268] group-hover:text-[#010268] transition-colors">
                        Learn More
                        <LucideIcons.ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <div className="glass-card-glow rounded-2xl p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-[#111827] mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-[#111827] text-sm mb-6 max-w-lg mx-auto">
                Let our team help you implement the right {solution.name.toLowerCase()} solution for your organization.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#010268] to-[#1a1b78] text-white text-sm font-medium hover:from-[#1a1b78] hover:to-[#010268] transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 hover:scale-105"
              >
                Contact Us
                <LucideIcons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
