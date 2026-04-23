export default function HowItWorksSection({ data }) {
  return (
    <section className="home-section bg-transparent overflow-hidden min-h-screen flex flex-col justify-center py-16 sm:py-20 lg:py-24">
      {/* We use max-w-[1500px] here so 5 cards can be HUGE side-by-side */}
      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-6 text-center">
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[rgb(13,27,94)]">
          {data.title}
        </h2>
        <p className="mt-4 text-[rgb(13,27,94)] text-sm sm:text-base font-semibold max-w-3xl mx-auto leading-relaxed">
          {data.description}
        </p>

        <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.values.map((card, index) => (
            <article key={card.title} className="group [perspective:1200px]">
              {/* aspect-square w-full guarantees perfect squares */}
              <div className="relative aspect-square w-full rounded-xl [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
                <div className={`absolute inset-0 rounded-xl overflow-hidden border border-[#e2e2e2] shadow-sm card-grad-${index} [backface-visibility:hidden]`}>
                  <div className="absolute inset-0 bg-black/30" />
                  {/* Bumped text size up to 8xl so the letters look big inside the large cards */}
                  <span className="absolute inset-0 flex items-center justify-center text-white text-5xl sm:text-6xl lg:text-8xl font-black tracking-wider">
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
              <p className="mt-4 text-[rgb(13,27,94)] text-base font-bold">{card.title}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}