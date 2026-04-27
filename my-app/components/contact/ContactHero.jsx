'use client';
import Image from 'next/image';

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#dfe6f2] pt-4">
      <div className="relative overflow-hidden bg-[#0b1538]">
        <div className="relative aspect-[16/6] min-h-[280px] w-full">
          <Image
            src="/decor/contactelements.svg"
            alt="Contact hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,12,32,0.08)_0%,rgba(8,15,38,0.40)_48%,rgba(8,15,38,0.86)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_left,rgba(109,133,255,0.16),transparent_24%)]" />

          <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-8 sm:top-8">
            <span className="h-9 w-3.5 skew-x-[-18deg] rounded-[2px] bg-white/95" />
            <span className="h-9 w-3.5 skew-x-[-18deg] rounded-[2px] bg-white/55" />
          </div>

          <div className="absolute left-5 top-5 hidden gap-8 text-[11px] font-medium text-white/85 sm:left-1/2 sm:flex sm:-translate-x-1/2 sm:tracking-[0.18em]">
            <span>PRODUCT</span>
            <span>SOLUTIONS</span>
            <span>PRICING</span>
            <span>RESOURCES</span>
            <span>COMPANY</span>
          </div>

          <div className="absolute left-5 bottom-5 max-w-2xl text-white sm:left-10 sm:bottom-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-white/72 sm:text-[11px]">
              Contact Us
            </p>
            <h1 className="mt-3 text-5xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-[5.4rem]">
              Let&apos;s Talk
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/88 sm:text-base">
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
