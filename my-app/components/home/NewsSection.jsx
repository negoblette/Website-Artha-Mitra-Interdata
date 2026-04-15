import Link from 'next/link';

function NewsRow({ title, excerpt, reverse, tone }) {
  return (
    <article className="w-full bg-[#cfd2d6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          <div className={`h-44 sm:h-56 md:h-64 ${tone} ${reverse ? 'md:order-2' : ''}`} />
          <div className={`flex items-center p-4 sm:p-5 md:p-7 ${reverse ? 'md:order-1' : ''}`}>
            <div className="max-w-lg">
              <h3 className="text-white text-3xl sm:text-4xl font-black leading-tight">{title}</h3>
              <p className="mt-3 text-white text-sm sm:text-[14px] leading-relaxed">
            {excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NewsSection({ data }) {
  const safeItems = Array.isArray(data?.items) && data.items.length > 0
    ? data.items
    : [{ excerpt: 'Latest updates and insights are coming soon.' }];

  const rows = [
    { title: 'Data Hacked', tone: 'news-photo-1' },
    { title: 'Malware', tone: 'news-photo-2', reverse: true },
    { title: 'Data Breach', tone: 'news-photo-3' },
  ];

  return (
    <section className="home-section relative overflow-hidden bg-transparent pt-8 sm:pt-10 md:pt-12 pb-10 sm:pb-12 md:pb-14">
      <div className="relative z-10">
        <h2 className="text-center text-4xl sm:text-5xl font-black text-[#0a0b85] mb-5 sm:mb-6 md:mb-8">NEWS & ARTICLES</h2>
        <div className="space-y-6 sm:space-y-7 md:space-y-8">
          {rows.map((row, i) => (
            <NewsRow
              key={row.title}
              title={row.title}
              reverse={row.reverse}
              tone={row.tone}
              excerpt={safeItems[i % safeItems.length].excerpt}
            />
          ))}
        </div>

        <div className="mt-6 sm:mt-8 flex justify-center px-4 sm:px-6">
          <Link
            href="/insight"
            className="inline-flex rounded-full border-2 border-black px-6 py-2 text-black text-sm sm:text-base font-semibold bg-white hover:bg-[#eceeff] transition-colors"
          >
            Visit Articles Page
          </Link>
        </div>
      </div>
    </section>
  );
}


