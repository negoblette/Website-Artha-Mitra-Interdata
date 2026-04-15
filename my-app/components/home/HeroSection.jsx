import Link from 'next/link';
import { Alegreya_Sans } from 'next/font/google';

const alegreyaSans = Alegreya_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
});

export default function HeroSection({ data }) {
  const words = (data.title || '').trim().split(/\s+/);
  const highlightIndex = 1;

  return (
    <section className="home-panel relative overflow-hidden bg-transparent pt-[calc(var(--nav-height)+1.25rem)] sm:pt-[calc(var(--nav-height)+1.75rem)] pb-16 sm:pb-20 lg:pb-24">
      <div className="hero-content-shell relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h1 className={`${alegreyaSans.className} hero-readable-title mt-2 sm:mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] text-black font-bold break-words`}>
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={index === highlightIndex ? 'text-[#0a0b85] font-extrabold' : ''}
            >
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>

        <p className="hero-readable-copy mt-10 text-base sm:text-lg text-black max-w-4xl mx-auto leading-relaxed font-semibold">
          {data.description}
        </p>

        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            href={data.cta.href}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-black text-black px-6 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base lg:text-lg font-semibold hover:bg-[#0a0b85] hover:text-white transition-colors"
          >
            Get to Know Us
          </Link>
          <Link
            href="/contact"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-black text-black px-6 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base lg:text-lg font-semibold hover:bg-[#0a0b85] hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

