'use client';

export default function KeyBenefits({ data }) {
  if (!data?.items?.length) {
    return null;
  }

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            Why Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
            {data.title}
          </h2>
          {data.subtitle ? <p className="text-[#111827] text-sm">{data.subtitle}</p> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {data.items.map((item, i) => (
            <article key={i} className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
              <p className="text-[#111827] text-sm leading-relaxed">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
