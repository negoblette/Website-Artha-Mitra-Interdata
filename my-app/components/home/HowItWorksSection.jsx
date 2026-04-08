export default function HowItWorksSection({ data }) {
  return (
    <section className="home-section bg-transparent overflow-hidden md:h-[calc(100svh-98px)] md:py-0">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center md:h-full md:flex md:flex-col md:justify-start md:pt-8 lg:pt-10">
        <h2 className="text-5xl sm:text-6xl font-black text-black">{data.title}</h2>
        <p className="mt-4 text-black text-lg sm:text-xl max-w-4xl mx-auto leading-snug">{data.description}</p>

        <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.values.map((card, index) => (
            <article key={card.title} className="group [perspective:1200px]">
              <div className="relative h-44 rounded-xl [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
                <div className={`absolute inset-0 rounded-xl overflow-hidden border border-[#e2e2e2] shadow-sm card-grad-${index} [backface-visibility:hidden]`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-7xl font-black tracking-wider">
                    {card.letter}
                  </span>
                </div>

                <div className="absolute inset-0 rounded-xl border border-[#0a0b85]/25 bg-gradient-to-br from-[#05063f] via-[#090b66] to-[#020212] p-4 text-center shadow-[0_18px_40px_rgba(10,11,133,0.22)] [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <div className="flex h-full flex-col items-center rounded-[0.85rem] border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-[2px]">
                    <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/65">
                      {card.title}
                    </span>
                    <p className="my-auto max-w-[25ch] text-[10px] leading-[1.4] text-white/82">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-black font-bold">{card.title}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


