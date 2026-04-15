import Link from 'next/link';

function NewsRow({ title, excerpt, reverse, tone }) {
  return (
    <article className="bg-[#d9dadd] border border-[#e5e5e5] rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={`h-36 sm:h-44 md:h-52 ${tone} ${reverse ? 'md:order-2' : ''}`} />
        <div className="p-3 sm:p-4 md:p-5">
          <h3 className="text-black text-2xl sm:text-3xl font-black leading-tight">{title}</h3>
          <p className="mt-2 text-black text-sm sm:text-[14px] leading-relaxed max-w-xl">
            {excerpt}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function NewsSection({ data }) {
  const rows = [
    { title: 'Data Hacked', tone: 'news-photo-1' },
    { title: 'Malware', tone: 'news-photo-2', reverse: true },
    { title: 'Data Breach', tone: 'news-photo-3' },
  ];

  return (
    <section className="home-section relative bg-transparent overflow-hidden">
      <div className="relative z-10 px-4 sm:px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-black text-black mb-4 sm:mb-5 md:mb-6">NEWS & ARTICLES</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {rows.map((row, i) => (
            <NewsRow
              key={row.title}
              title={row.title}
              reverse={row.reverse}
              tone={row.tone}
              excerpt={data.items[i % data.items.length].excerpt}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/insight"
            className="inline-flex rounded-full border-2 border-black px-6 py-2 text-black text-sm sm:text-base font-semibold bg-[#eceeff] hover:bg-[#d7d9ff] transition-colors"
          >
            Visit Articles Page
          </Link>
        </div>
      </div>
    </section>
  );
}


