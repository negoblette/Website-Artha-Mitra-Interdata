import { Eye, Target } from 'lucide-react';

export default function VisionMission({ vision, mission }) {
  return (
    <section className="relative flex min-h-screen items-center bg-transparent py-14">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 md:gap-8">
        <article className="vision-card vision-card-enter flex min-h-[320px] flex-col rounded-2xl bg-[#0a0b85] p-7 text-white shadow-[0_16px_34px_rgba(10,11,133,0.28)] md:min-h-[380px] md:p-9">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
              <Eye size={16} />
            </span>
            <h3 className="text-2xl font-bold">Vision</h3>
          </div>
          <p className="text-sm leading-relaxed text-white/90 md:text-base">{vision}</p>
        </article>

        <article className="vision-card vision-card-enter vision-card-enter-delay flex min-h-[320px] flex-col rounded-2xl bg-[#0a0b85] p-7 text-white shadow-[0_16px_34px_rgba(10,11,133,0.28)] md:min-h-[380px] md:p-9">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
              <Target size={16} />
            </span>
            <h3 className="text-2xl font-bold">Mission</h3>
          </div>
          <p className="text-sm leading-relaxed text-white/90 md:text-base">{mission}</p>
        </article>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(122,138,229,0.32),transparent_65%)]" />
    </section>
  );
}
