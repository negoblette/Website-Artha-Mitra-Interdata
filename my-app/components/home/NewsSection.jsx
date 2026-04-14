import Link from 'next/link';

function NewsRow({ title, excerpt, reverse, tone, category }) {
  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(242,245,249,0.95)_100%)] shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(15,23,42,0.12)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch">
        <div className={`relative h-40 md:h-full min-h-[10rem] overflow-hidden ${tone} ${reverse ? 'md:order-2' : ''}`} />
        <div className="p-4 md:p-5 lg:p-6">
          <p className="inline-flex w-fit rounded-full border border-[#0a0b85]/15 bg-[#eceeff] px-2.5 py-0.75 text-[9px] font-bold uppercase tracking-[0.22em] text-[#0a0b85]">
            {category}
          </p>
          <h3 className="mt-2.5 text-black text-xl sm:text-2xl font-black leading-tight tracking-tight">
            {title}
          </h3>
          <p className="mt-2.5 text-black/78 text-[13px] sm:text-[14px] leading-relaxed max-w-xl">
            {excerpt}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function NewsSection({ data }) {
  const visuals = [
    { tone: 'news-photo-1' },
    { tone: 'news-photo-2', reverse: true },
    { tone: 'news-photo-3' },
  ];

  return (
    <section className="home-section mt-10 md:mt-12 relative bg-transparent overflow-hidden">
      <div className="relative z-10">
        <div className="text-center mb-4 md:mb-6">
          <span className="inline-block text-[#737373] text-[11px] font-semibold tracking-[0.28em] uppercase mb-2.5">
            Top Trending News
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
            {data.title}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-black/75 max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        <div className="space-y-3.5 md:space-y-4">
          {data.items.slice(0, visuals.length).map((item, i) => (
            <NewsRow
              key={item.slug}
              title={item.title}
              category={item.category}
              reverse={visuals[i].reverse}
              tone={visuals[i].tone}
              excerpt={item.excerpt}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href={data.cta.href}
            className="inline-flex items-center justify-center rounded-full border border-black px-6 py-2 text-sm sm:text-base font-semibold text-black bg-[#eceeff] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d7d9ff] hover:shadow-[0_12px_24px_rgba(10,11,133,0.12)]"
          >
            {data.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
