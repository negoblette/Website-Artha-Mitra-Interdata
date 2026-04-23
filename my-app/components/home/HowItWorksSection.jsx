export default function HowItWorksSection({ data }) {
  const cards = [
    {
      letter: 'C',
      title: 'Commitment',
      description: 'We understand the importance of delivering on our promises and are dedicated to excellence in completing the tasks at hand.',
    },
    {
      letter: 'I',
      title: 'Integrity',
      description: 'We abide to a set of moral standards that is unwavering and steadfast - we always look to do the right thing.',
    },
    {
      letter: 'P',
      title: 'Professionalism',
      description: 'We believe in our competence and seek to achieve the best results in all that we do.',
    },
    {
      letter: 'T',
      title: 'Teamwork',
      description: 'Understanding that synergy enables us to achieve more, we always collaborate in formulating the optimum solution.',
    },
    {
      letter: 'A',
      title: 'Advancement',
      description: 'Encapsulating our vision and purpose as a company, we ensure every delivery provides tangible value that advances the business.',
    },
  ];

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

        {/* lg:grid-cols-5 keeps them in 1 row. gap-6 gives them nice spacing. */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {cards.map((card, index) => (
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

                <div className="absolute inset-0 rounded-xl border border-[#0a0b85]/35 bg-white p-4 text-left [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-sm overflow-y-auto no-scrollbar">
                  <p className="text-[11px] sm:text-xs lg:text-sm leading-snug text-[#111827] pr-1">
                    {card.description}
                  </p>
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