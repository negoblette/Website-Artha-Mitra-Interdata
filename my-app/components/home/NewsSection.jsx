import Link from 'next/link';
import {ArrowRight, CalendarDays, Clock3} from 'lucide-react';




// Helpers

function formatDate(value){
  if(!value) return 'May 15, 2024';
  return value;
}

function formatReadTime(value){
  if(!value) return '5 min read';
  return value;
}

// Timeline Item
function NewsTimelineItems({ item, index, isActive}) {
  return (

    <article className="relative grid grid-cols-[64px_1fr] gap-6 pb-12 last:pb-0">
      
      {/* Timeline Circle */}
      <div className ="relative flex justify-center">
        <div
          className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border text-xl font-black transition-all ${
            isActive 
              ? 'border-[#2554f4] bg-[#2554f4] text-white shadow-[0_10px_30px_rgba(37,84,244,0.28)]'
              : 'border-[#d8dced] bg-white text-[#111a4a] shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
          }`}
        >
          {String(index  + 1).padStart(2, '0')}
        </div>

        {/* line */}
        {index !== 2 && (
          <div className="absolute top-14 h-[calc(100%-8px)] w-px bg-[linear-gradient(180deg, rgba(37,84,244,0.2), rgba(148,163,184,0.2))]" />
        )}
      </div>
      
      {/* content */}
      <div className="pt-1">
        <p className="text-sm font-black uppercase tracking-[0.08em] text-[#2554f4]">
          {item.category || 'Technology'}
        </p>

        <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#09124d] sm:text-[2.2rem]">
          {item.title}
        </h3>

        <p className="mt-3 max-w-[34rem] text-lg font-medium leading-[1.65] text-[#505a78]">
          {item.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-[15px] font-medium text-[#6b728a]">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={17} />
              {formatDate(item.date)}
          </span>
        </div>

      </div>
    </article> 
  );
}


// MAIN SECTION

export default function NewsSection({ data }) {
  const items = data?.items?.slice(0, 2 ) ?? [];
  const featured = items[0];

    return (
      <section className="relative overflow-hidden bg-white px-6 py-16 sm:px-8 lg:px-10 lg:py-24">

        {/* Background Glow */}
        <div className ="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle, rgba(37, 84, 244, 0.12), transparent_72%)] blur-3xl" />
          <div className="absolute right-[10%] top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(13,27,94,0.08),transparent_72%)] blur-3xl"/>
          <div className="absolute inset-x-[18%] bottom-0 h-32 bg-[radial-gradient(circle,rgba(37, 84, 244, 0.08),transparent_72%))]"/>
        </div>

        <div className="relative mx-auto max-w-[1440px]">
          
          {/* heading */}
          <div className="text-center">
            <h2 className="text-4xl font-black tracking-[-0.06em] text-[-#09124d] sm:text-5xl lg:text-[5rem]">
              News & <span className="text-[#2554f4]">Article</span>
            </h2>

            <div className="mx-auto mt-5 flex items-center justify-center gap-2">
              <div className="h-[6px] w-20 roounded-full bg-[#2554f4]"/>
              <div className="h-[6px] w-[6px] rounded-full bg-[#2554f4]"/>
            </div>
          </div>
        

        {/* Content Grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.08fr] lg:items-start lg:gap-14 xl:gap-20">

          {/* left block timeline */}
          <div className="order-2 lg:order-1">
            {items.map((item, index) => (
              <NewsTimelineItems
                key={item.slug ?? item.title}
                item={item}
                index={index}
                isActive={index === 0}
                />
            ))}
          </div>

          {/* Featured Card */}
          <div className="order-1 overflow-hidden rounded-[2rem] border border-[#dbe4ff] bg-white shadow-[0_24px_60px_rgba(37,84,244,0.12)] lg:order-2">

            {/* Image */}
            <div className="h-[260px] w-full bg-[linear-gradient(135deg,#263d90_0%,#4b67c8_30%,#c12337_68%,#09134d_100%)] sm:h-[320px] lg:h-[320px]">
              {featured?.image? (
                <img 
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
              ): (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgba(255,255,255,0.15),transparent_32%), linear-gradient(135deg,#253b8a_0%, #5a74d5_28%, #cf3348_65%, #09124d_100%)]">
                  <div className="relative h-28 w-24 rounded-[1.6rem] border border-white/30 bg-[linear-gradient(180deg, #ff7b8f, #cf2744)] shadow-[0_20px_40px_rgba(190,35,60,0.35)]"/>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 lg:p-9">
              <span className ="inline-flex rounded-full bg-[#edf3ff] px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-[#2554f4]">
                Featured Article
              </span>

              <h3 className="mt-4 text-3xl font-black tracking-[-0.05em] text-[#09124d] sm:text-[2.5rem]">
                {featured?.title || 'Featured Article'}
              </h3>

              <p className="mt-4 text-lg font-medium leading-[1.7] text-[#515b79]">
                {featured?.excerpt || 'Default excerpt...'}
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-12 flex items-center justify-center gap-4 sm:mt-14">
          <Link 
            href={data?.cta?.href || '/insight'}
            className="inline-flex items-center gap-3 rounded-full bg-[#2554f4] px-8 py-4 text-lg font-bold text-white shadow-[0_18px_40px_rgba(37,84,244,0.32)] transition hover:-translate-y-0.5 hover:bg-[#1948ec]"
          >
            {data?.cta?.label || 'View All Articles'}
            <ArrowRight size={22}/>
          </Link>
        </div>

      </div>        
      </section>
    )
}

// function NewsRow({ title, excerpt, reverse, tone, image }) {
//   return (
//     <article className="bg-[#d9dadd] border border-[#e5e5e5] rounded-lg overflow-hidden">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
//         {image ? (
//           <div className={`h-44 md:h-52 overflow-hidden ${reverse ? 'md:order-2' : ''}`}>
//             <img src={image} alt={title} className="w-full h-full object-cover" />
//           </div>
//         ) : (
//           <div className={`h-44 md:h-52 ${tone} ${reverse ? 'md:order-2' : ''}`} />
//         )}
//         <div className="p-4 md:p-5">
//           <h3 className="text-black text-[25px] font-black leading-tight">{title}</h3>
//           <p className="mt-2 text-black font-semibold text-sm sm:text-[18px] leading-relaxed max-w-xl">
//             {excerpt}
//           </p>
//         </div>
//       </div>
//     </article>
//   );
// }

// export default function NewsSection({ data }) {
//   const rows = [
//     { title: 'Data Hacked', tone: 'news-photo-1' },
//     { title: 'Malware', tone: 'news-photo-2', reverse: true },
//     { title: 'Data Breach', tone: 'news-photo-3' },
//   ];

//   return (
//     <section className="relative bg-transparent overflow-hidden py-10 md:py-14">
//       <div className="relative z-10 pb-10">
//         <h2 className= "text-center text-3xl sm:text-4xl lg:text-5xl font-black text-[rgb(13,27,94)] mb-4 md:mb-5">News & Articles</h2>
//         <div className="space-y-4 md:space-y-5">
//           {rows.map((row, i) => (
//             <NewsRow
//               key={row.title}
//               title={row.title}
//               reverse={row.reverse}
//               tone={row.tone}
//               image={data.items[i % data.items.length].image}
//               excerpt={data.items[i % data.items.length].excerpt}
//             />
//           ))}
//         </div>

//         <div className="mt-6 flex justify-center">
//           <Link
//             href="/insight"
//             className= "inline-flex rounded-full border-2 border-black px-6 py-2 text-black text-sm sm:text-base font-semibold hover:bg-[rgba(13,27,94)] hover:text-white transition-colors"
//           >
//             Visit Articles Page
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }


