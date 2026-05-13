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

    <article className="relative grid grid-cols-[2.5rem_1fr] sm:grid-cols-[4rem_1fr] gap-3 sm:gap-6 pb-8 sm:pb-12 last:pb-0">
      
      {/* Timeline Circle */}
      <div className ="relative flex justify-center">
        <div
          className={`relative z-10 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full border text-base sm:text-xl font-black transition-all ${
            isActive 
              ? 'border-[#2554f4] bg-[#0d1364] text-white shadow-[0_10px_30px_rgba(37,84,244,0.28)]'
              : 'border-[#d8dced] bg-white text-[#111a4a] shadow-[0_8px_24px_rgba(15,23,42,0.08)]'
          }`}
        >
          {String(index  + 1).padStart(2, '0')}
        </div>

        {/* line */}
        {index !== 2 && (
          <div className="absolute top-10 sm:top-14 h-[calc(100%-8px)] w-px bg-[linear-gradient(180deg, rgba(37,84,244,0.2), rgba(148,163,184,0.2))]" />
        )}
      </div>
      
      {/* content */}
      <div className="pt-0 sm:pt-1">
        <p className="text-xs sm:text-sm font-black uppercase tracking-[0.08em] text-[#0d1364]">
          {item.category || 'Technology'}
        </p>

        <h3 className="mt-1.5 sm:mt-2 text-xl sm:text-3xl font-black tracking-[-0.04em] text-[#09124d] lg:text-[2.2rem]">
          {item.title}
        </h3>

        <p className="mt-2 sm:mt-3 max-w-full text-sm sm:text-lg font-medium leading-[1.5] sm:leading-[1.65] text-[#505a78] text-justify">
          {item.excerpt}
        </p>

        <div className="mt-3 sm:mt-5 flex flex-wrap items-center gap-4 text-xs sm:text-[0.9375rem] font-medium text-[#6b728a]">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={15} className="sm:hidden" />
            <CalendarDays size={17} className="hidden sm:block" />
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
      <section className="relative overflow-hidden bg-white px-4 py-[clamp(3.5rem,8vh,6rem)] sm:px-8 lg:px-10">

        {/* Background Glow */}
        <div className ="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle, rgba(37, 84, 244, 0.12), transparent_72%)] blur-3xl" />
          <div className="absolute right-[10%] top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(13,27,94,0.08),transparent_72%)] blur-3xl"/>
          <div className="absolute inset-x-[18%] bottom-0 h-32 bg-[radial-gradient(circle,rgba(37, 84, 244, 0.08),transparent_72%))"/>
        </div>

        <div className="relative mx-auto max-w-[92vw]">
          
          {/* heading */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.06em] text-[#0d1364] lg:text-[5rem]">
              News & Article
            </h2>


          </div>
        

        {/* Content Grid */}
        <div className="mt-8 sm:mt-14 grid gap-8 sm:gap-12 lg:grid-cols-[1fr_1.08fr] lg:items-start lg:gap-14 xl:gap-20">

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
          <div className="order-1 overflow-hidden rounded-xl sm:rounded-[2rem] border border-[#dbe4ff] bg-white shadow-[0_24px_60px_rgba(37,84,244,0.12)] lg:order-2">

            {/* Image */}
            <div className="h-[22vh] sm:h-[28vh] w-full bg-[linear-gradient(135deg,#263d90_0%,#4b67c8_30%,#c12337_68%,#09134d_100%)] lg:h-[34vh]">
              {featured?.image? (
                <img 
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
              ): (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgba(255,255,255,0.15),transparent_32%), linear-gradient(135deg,#253b8a_0%, #5a74d5_28%, #cf3348_65%, #09124d_100%)]">
                  <div className="relative h-20 sm:h-28 w-16 sm:w-24 rounded-xl sm:rounded-[1.6rem] border border-white/30 bg-[linear-gradient(180deg, #ff7b8f, #cf2744)] shadow-[0_20px_40px_rgba(190,35,60,0.35)]"/>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8 lg:p-9">
              <span className ="inline-flex rounded-full bg-[#edf3ff] px-3 py-1 text-[0.625rem] sm:text-xs font-black uppercase tracking-[0.08em] text-[#2554f4]">
                Featured Article
              </span>

              <h3 className="mt-3 sm:mt-4 text-xl sm:text-3xl font-black tracking-[-0.05em] text-[#09124d] lg:text-[2.5rem]">
                {featured?.title || 'Featured Article'}
              </h3>

              <p className="mt-3 sm:mt-4 text-sm sm:text-lg font-medium leading-[1.6] sm:leading-[1.7] text-[#515b79] text-justify">
                {featured?.excerpt || 'Default excerpt...'}
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-8 sm:mt-12 flex items-center justify-center gap-4 lg:mt-14">
          <Link 
            href={data?.cta?.href || '/insight'}
            className="inline-flex items-center gap-2 sm:gap-3 rounded-full bg-[#0d1364] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-bold text-white shadow-[0_18px_40px_rgba(37,84,244,0.32)] transition hover:-translate-y-0.5 hover:bg-[#0f1675]"
          >
            {data?.cta?.label || 'View All Articles'}
            <ArrowRight size={18} className="sm:hidden" />
            <ArrowRight size={22} className="hidden sm:block" />
          </Link>
        </div>

      </div>        
      </section>
    )
}
