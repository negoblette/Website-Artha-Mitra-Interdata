'use client';
import Image from 'next/image';

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#dfe6f2] pt-4">
      <div className="relative overflow-hidden bg-transparent">
        <div className="relative aspect-[24/6] right-1 min-h-[280px] w-full">
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

        

          <div className="absolute left-20 bottom-10 max-w-2xl text-white sm:left-30 sm:bottom-20 lg:left-50">
            
            <div className="absolute left-[20rem] bottom-1 flex items-center gap-2 sm:left-12 sm:bottom-22.5  lg:left-[31rem]">
              <span className="h-15 w-4.5 skew-x-[18deg] rounded-[2px] bg-white/95" />
              <span className="h-15 w-4.5 skew-x-[18deg] rounded-[2px] bg-white/55" />
            </div>

            <h1 className="mt-3 text-5xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-[5.4rem]">
              Let&apos;s Talk
            </h1>
            
            <p className="mt-4 max-w-xl text-[16px] font-semibold leading-8 text-white/75 sm:text-[19px]">
              We&apos;re here to help and answer any questions you might have.
              <br />
              Feel free to reach out - we&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
