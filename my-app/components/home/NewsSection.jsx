import Link from 'next/link';

function NewsRow({ title, excerpt, reverse, tone, image }) {
  return (
    <article className="bg-[#d9dadd] border border-[#e5e5e5] rounded-lg overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
        {image ? (
          <div className={`h-44 md:h-52 overflow-hidden ${reverse ? 'md:order-2' : ''}`}>
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={`h-44 md:h-52 ${tone} ${reverse ? 'md:order-2' : ''}`} />
        )}
        <div className="p-4 md:p-5">
          <h3 className="text-black text-[25px] font-black leading-tight">{title}</h3>
          <p className="mt-2 text-black font-semibold text-sm sm:text-[18px] leading-relaxed max-w-xl">
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
      <div className="relative z-10 pb-30">
        <h2 className= "text-center text-[40px] font-black text-[rgb(13,27,94)] mb-4 md:mb-5">NEWS & ARTICLES</h2>
        <div className="space-y-4 md:space-y-5">
          {rows.map((row, i) => (
            <NewsRow
              key={row.title}
              title={row.title}
              reverse={row.reverse}
              tone={row.tone}
              image={data.items[i % data.items.length].image}
              excerpt={data.items[i % data.items.length].excerpt}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/insight"
            className= "inline-flex rounded-full border-2 border-black px-6 py-2 text-black text-sm sm:text-base font-semibold hover:bg-[rgba(13,27,94)] hover:text-white transition-colors"
          >
            Visit Articles Page
          </Link>
        </div>
      </div>
    </section>
  );
}


