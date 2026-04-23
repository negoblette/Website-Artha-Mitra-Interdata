'use client';
import Link from 'next/link';
import WaveCanvas from './WaveCanvas';

export default function HeroSection({ data }) {
  const words = data.title.split(' ');

  return (
    <section className="home-panel relative overflow-hidden bg-white min-h-screen flex flex-col items-center justify-center">
      <WaveCanvas />

      <div className="hero-content-shell relative z-10 w-full max-w-10xl mx-auto px-6 sm:px-8 lg:px-10 text-center">

        <h1 className="hero-fade-2 mb-2 max-w-6xl mx-auto text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[1.05] lg:leading-[0.95] text-[rgb(107,107,184)] font-bold">
          {words[0]} <span className="text-[rgb(13,27,94)] font-extrabold">{words[1]}</span> {words[2]} {words[3]}<br />{words[4]}
        </h1>

        <p className="hero-fade-3 mt-8 mb-12 text-3xl sm:text-base lg:text-2xl text-[rgb(13,27,94)] max-w-5xl mx-auto leading-relaxed font-semibold">
          {data.description}
        </p>

        <div className="hero-fade-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={data.cta.href}
            className="inline-flex min-w-44 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold hover:bg-[rgb(19,27,94)] hover:text-white transition-colors"
          >
            Get to Know Us
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-w-44 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold hover:bg-[rgb(19,27,94)] hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
    </section>
  );
}