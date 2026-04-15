import Link from 'next/link';
import { Alegreya_Sans } from 'next/font/google';

const alegreyaSans = Alegreya_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
});

export default function HeroSection({ data }) {
  const words = (data.title || '').trim().split(/\s+/);
  const highlightedWord = words[1] || '';
  const beforeHighlight = words[0] || '';
  const afterHighlightWords = words.slice(2);
  const secondLineStart = afterHighlightWords.length > 0 ? afterHighlightWords.length - 1 : 0;
  const firstLineWords = afterHighlightWords.slice(0, secondLineStart).join(' ');
  const secondLineWord = afterHighlightWords[secondLineStart] || '';

  return (
    <section className="home-panel relative overflow-hidden bg-transparent pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-28">
      <div className="hero-content-shell relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-flex max-w-full items-center rounded-full bg-[#21057e] px-4 sm:px-7 py-2 text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-widest text-white font-semibold uppercase">
          <span
            className="mr-3.5 h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_0_2px_rgba(34,197,94,0.22),0_0_10px_rgba(34,197,94,0.9)] animate-pulse"
            aria-hidden="true"
          />
          IT Solutions Integrator and Provider
        </span>

        <h1 className={`${alegreyaSans.className} hero-readable-title mt-7 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] text-black font-bold break-words`}>
          {beforeHighlight} {highlightedWord ? <span className="text-[#0a0b85] font-extrabold">{highlightedWord}</span> : null} {firstLineWords}
          {secondLineWord ? <><br />{secondLineWord}</> : null}
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

