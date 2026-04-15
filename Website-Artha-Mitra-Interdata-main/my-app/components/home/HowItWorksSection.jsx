export default function HowItWorksSection({ data }) {
  const cards = [
    {
      letter: 'C',
      title: 'Commitment',
      description:
        'We understand the importance of delivering on our promises and are dedicated to excellence in completing the tasks at hand.',
    },
    {
      letter: 'I',
      title: 'Integrity',
      description:
        'We abide to a set of moral standards that is unwavering and steadfast - we always look to do the right thing.',
    },
    {
      letter: 'P',
      title: 'Professionalism',
      description:
        'We believe in our competence and seek to achieve the best results in all that we do.',
    },
    {
      letter: 'T',
      title: 'Teamwork',
      description:
        'Understanding that synergy enables us to achieve more, we always collaborate in formulating the optimum solution.',
    },
    {
      letter: 'A',
      title: 'Advancement',
      description:
        'Encapsulating our vision and purpose as a company, we ensure every delivery provides tangible value that advances the business.',
    },
  ];

  return (
    <section className="home-section bg-transparent overflow-hidden md:h-[calc(100svh-98px)] md:py-0">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center mt-20 md:h-full md:flex md:flex-col md:justify-start md:pt-8 lg:pt-10">
        <h2 className="text-[50px] font-black text-[rgb(13,27,94)]">{data.title}</h2>
        <p className="mt-4 text-[rgb(13,27,94)] text-[15px] font-semibold max-w-4xl mx-auto leading-snug">{data.description}</p>

        <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {cards.map((card, index) => (
            <article key={card.title} className="group [perspective:1200px]">
              <div className="relative h-44 rounded-xl [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
                <div className={`absolute inset-0 rounded-xl overflow-hidden border border-[#e2e2e2] shadow-sm card-grad-${index} [backface-visibility:hidden]`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute inset-0 flex items-center justify-center text-white text-7xl font-black tracking-wider">
                    {card.letter}
                  </span>
                </div>

                <div className="absolute inset-0 rounded-xl border border-[#0a0b85]/35 bg-white p-2.5 text-left [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-sm">
                  <p className="text-[11px] leading-snug text-[#111827] pr-1">
                    {card.description}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[rgb(13,27,94)] font-bold">{card.title}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


