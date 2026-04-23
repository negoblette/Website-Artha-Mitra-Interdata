'use client';
import Link from 'next/link';
import WaveCanvas from './WaveCanvas';

export default function HeroSection({ data }) {
  const accentWord = data.accentWord?.trim();
  const accentPattern = accentWord ? new RegExp(`\\b${accentWord}\\b`) : null;
  const titleParts = accentPattern ? data.title.split(accentPattern) : [data.title];

  return (
    <section className="home-panel relative overflow-visible bg-transparent pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28">
      <img 
        src="/decor/heroelements.svg" 
        alt="" 
        aria-hidden="true"
        className="pointer-events-none absolute top-20 bottom-[-40px] z-0 w-full object-cover opacity-100 max-[639px]:left-1/2 max-[639px]:top-[14rem] max-[639px]:bottom-auto max-[639px]:w-[860px] max-[639px]:max-w-none max-[639px]:-translate-x-1/2 max-[639px]:object-contain min-[640px]:max-[1023px]:left-1/2 min-[640px]:max-[1023px]:top-16 min-[640px]:max-[1023px]:bottom-auto min-[640px]:max-[1023px]:w-[1080px] min-[640px]:max-[1023px]:max-w-none min-[640px]:max-[1023px]:-translate-x-1/2 min-[640px]:max-[1023px]:object-contain"
      />
      <div className="hero-content-shell mt-7 relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-flex items-center rounded-full bg-[#21057e] px-7 py-2 text-[11px] tracking-widest text-white font-semibold uppercase">
          <span
            className="mr-3.5 h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_0_2px_rgba(34,197,94,0.22),0_0_10px_rgba(34,197,94,0.9)] animate-pulse"
            aria-hidden="true"
          />
          {data.eyebrow}
        </span>

        <h1 className={`${alegreyaSans.className} hero-readable-title mt-40 text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-black font-bold`}>
          {titleParts[0]}
          {accentWord ? <span className="text-[#0a0b85] font-extrabold">{accentWord}</span> : null}
          {titleParts[1]}
        </h1>

        <p className="hero-fade-3 mt-8 mb-12 text-sm sm:text-base lg:text-lg text-[rgb(13,27,94)] max-w-3xl mx-auto leading-relaxed font-semibold">
          {data.description}
        </p>

        <div className="hero-fade-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={data.cta.href}
            className="inline-flex min-w-44 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold hover:bg-[rgb(19,27,94)] hover:text-white transition-colors"
          >
            {data.cta.label}
          </Link>
          <Link
            href={data.secondaryCta.href}
            className="inline-flex min-w-48 items-center justify-center rounded-full border-2 border-black text-black px-8 py-2.5 text-base sm:text-lg font-semibold hover:bg-[#0a0b85] hover:text-white transition-colors"
          >
            {data.secondaryCta.label}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
    </section>
  );
}