'use client';
import Image from 'next/image';

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#dfe6f2] pt-4">
      <div className="relative overflow-hidden bg-transparent">
        <div className="relative aspect-[24/6] right-1 min-h-[320px] w-full lg:min-h-[420px]">
          <Image
            src="/images/contact1.jpg"
            alt="Contact hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,32,0.08)_0%,rgba(8,15,38,0.40)_48%,rgba(8,15,38,0.86)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_left,rgba(109,133,255,0.16),transparent_24%)]" />

        

          <div className="relative z-10 mx-auto flex min-h-[320px] w-full max-w-[1600px] items-end px-4 pb-8 sm:min-h-[320px] sm:px-6 sm:pb-12 lg:min-h-[420px] lg:px-20 lg:pb-16">
            <div>
              <div className="relative z-10 inline-flex items-end gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
                <h1 className="mt-2 sm:mt-3 product-hero-title-light">
                  Let&apos;s Talk
                </h1>

                <div className="mb-1 flex shrink-0 items-center gap-1.5 sm:gap-2 md:mb-2 lg:mb-1">
                  <span className="h-8 w-2 skew-x-[18deg] rounded-[2px] bg-white/95 sm:h-10 sm:w-2.5 md:h-12 md:w-3 lg:h-16 lg:w-6" />
                  <span className="h-8 w-2 skew-x-[18deg] rounded-[2px] bg-white/55 sm:h-10 sm:w-2.5 md:h-12 md:w-3 lg:h-16 lg:w-6" />
                </div>
              </div>
              
              <p className="relative z-10 product-hero-copy-light">
                We&apos;re here to help and answer any questions you might have.
                
                Feel free to reach out - we&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
