'use client';
import Link from 'next/link';
import WaveCanvas from './WaveCanvas';

export default function HeroSection({ data }) {
  const words = data.title.split(' ');

  return (
    <section className="home-panel relative overflow-hidden bg-white min-h-screen flex flex-col items-center justify-center">
      <WaveCanvas />

      <div className="hero-content-shell relative z-10 max-w-6xl mx-auto pt-30 px-4 sm:px-6 text-center">

        <h1 className="hero-fade-2 mb-2 text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-[rgb(107,107,184)] font-bold">
          {words[0]} <span className="text-[rgb(13,27,94)] font-extrabold">{words[1]}</span> {words[2]} {words[3]}<br />{words[4]}
        </h1>

        <p className="hero-fade-3 mt-9 mb-17 text-base sm:text-lg text-[rgb(13,27,94)] max-w-4xl mx-auto leading-relaxed font-semibold">
          {data.description}
        </p>

        <div className="hero-fade-4 mb-20 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={data.cta.href}
            className="inline-flex min-w-48 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-8 py-2.5 text-base font-semibold text-[15px] hover:bg-[rgb(19,27,94)] hover:text-white transition-colors"
          >
            Get to Know Us
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-w-48 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-8 py-2.5 text-base font-semibold text-[15px] hover:bg-[rgb(19,27,94)] hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
      {/* Bottom fade to blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
    </section>
  );
}