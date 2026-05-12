'use client';
import Link from 'next/link';
import WaveCanvas from './WaveCanvas';

export default function HeroSection({ data }) {
  const [firstWord = '', highlightWord = '', ...restWords] = data.title.split(' ');
  const remainingText = restWords.join(' ');

  return (
    <section className="home-panel relative overflow-x-hidden bg-white min-h-[100svh] flex flex-col items-center justify-center">
      <style>{`
        @keyframes heroBadgePulse {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
      <WaveCanvas />

      <div className="hero-content-shell relative z-10 w-full max-w-10xl mx-auto px-4 sm:px-6 lg:px-10 text-center pt-[max(6rem,10vh)] pb-[max(4rem,8vh)]">

        <div className="hero-fade-1 flex justify-center mb-8 sm:mb-10">
          <span
            className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[0.625rem] sm:text-sm font-semibold tracking-[0.12em] sm:tracking-[0.15em] uppercase text-white"
            style={{ background: 'linear-gradient(135deg, rgb(10, 11, 133), rgb(20, 20, 80))' }}
          >
            <span
              className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5"
            >
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{
                  backgroundColor: '#22c55e',
                  animation: 'heroBadgePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5"
                style={{ backgroundColor: '#22c55e' }}
              />
            </span>
            Your 24/7 IT Consultant
          </span>
        </div>

        <h1 className="hero-fade-2 mb-2 max-w-7xl mx-auto text-[clamp(2.6rem,7.5vw,7.4rem)] leading-[1.03] sm:leading-[0.98] text-[rgb(107,107,184)] font-bold text-balance break-words">
          {firstWord}{' '}
          <span className="text-[rgb(13,27,94)] font-extrabold">{highlightWord}</span>{' '}
          {remainingText}
        </h1>

        <p className="hero-fade-3 mt-4 sm:mt-8 mb-8 sm:mb-12 text-[clamp(1rem,2.4vw,1.65rem)] text-[rgb(13,27,94)] max-w-5xl mx-auto leading-relaxed font-semibold px-2 sm:px-0 text-balance">
          {data.description}
        </p>

        <div className="hero-fade-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <Link
            href={data.cta.href}
            className="inline-flex min-w-[8.75rem] sm:min-w-44 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-5 sm:px-8 py-2.5 text-sm sm:text-base font-semibold hover:bg-[rgb(19,27,94)] hover:text-white transition-colors"
          >
            Get to Know Us
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-w-[8.75rem] sm:min-w-44 items-center justify-center rounded-full border-2 border-[rgb(19,27,94)] text-[rgb(19,27,94)] px-5 sm:px-8 py-2.5 text-sm sm:text-base font-semibold hover:bg-[rgb(19,27,94)] hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[6vh] sm:h-[7vh] bg-gradient-to-t from-white to-transparent pointer-events-none z-0" />
    </section>
  );
}