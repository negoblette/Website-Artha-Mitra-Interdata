export default function HistorySection({ data }) {
  return (
    <section id="history" className="relative flex min-h-screen items-center bg-transparent py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="history-intro mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black text-[#0a0b85] md:text-5xl">{data.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-black/80 md:text-base">{data.description.split('\n')[0]}</p>
        </div>

        <div className="mx-auto mt-9 max-w-5xl space-y-3.5 md:space-y-4">
          {data.milestones.map((milestone, i) => (
            <div
              key={`${milestone.year}-${i}`}
              className="history-item history-item-enter relative flex items-stretch gap-4"
              style={{ '--history-delay': `${i * 90}ms` }}
            >
              <div className="relative w-16 shrink-0 md:w-[76px]">
                <div className="absolute left-6 top-0 h-full w-px bg-[#c8cdf2]" />
                <span className="relative z-10 mt-3 block w-fit rounded-full bg-[#0a0b85] px-3 py-1.5 text-xs font-bold text-white md:text-sm">
                  {milestone.year}
                </span>
              </div>

              <article className="w-full rounded-2xl bg-[#0a0b85] px-6 py-[18px] text-white shadow-[0_14px_30px_rgba(10,11,133,0.22)] md:px-6 md:py-5">
                <p className="text-sm leading-relaxed text-white/95">{milestone.description}</p>
              </article>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-sm leading-relaxed text-black/75 md:text-base">
            {data.description.split('\n').slice(1).join(' ').trim()}
          </p>
        </div>
      </div>
    </section>
  );
}
