// import { Eye, Target } from 'lucide-react';

// export default function VisionMission({ vision, mission }) {
//   return (
//     <section className="relative flex min-h-screen items-center bg-transparent py-14">
//       <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 sm:px-6 md:grid-cols-2 md:gap-8">
//         <article className="vision-card vision-card-enter flex min-h-[320px] flex-col rounded-2xl bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-7 text-white shadow-[0_16px_34px_rgba(10,11,133,0.28)] md:min-h-[380px] md:p-9">
//           <div className="mb-5 flex items-center gap-3">
//             <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
//               <Eye size={16} />
//             </span>
//             <h3 className="text-2xl font-bold">Vision</h3>
//           </div>
//           <p className="text-sm leading-relaxed text-white/90 md:text-base">{vision}</p>
//         </article>

//         <article className="vision-card vision-card-enter vision-card-enter-delay flex min-h-[320px] flex-col rounded-2xl bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-7 text-white shadow-[0_16px_34px_rgba(10,11,133,0.28)] md:min-h-[380px] md:p-9">
//           <div className="mb-5 flex items-center gap-3">
//             <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
//               <Target size={16} />
//             </span>
//             <h3 className="text-2xl font-bold">Mission</h3>
//           </div>
//           <p className="text-sm leading-relaxed text-white/90 md:text-base">{mission}</p>
//         </article>
//       </div>

//       <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(122,138,229,0.32),transparent_65%)]" />
//     </section>
//   );
// }

'use client';
import { Eye, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisionMission({ vision, mission }) {
  return (
    <section data-no-reveal="true" className="relative overflow-visible py-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Core Direction
          </span>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-[rgba(13,27,94)] sm:text-5xl">
            Vision & Mission
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-black sm:text-base">
            The principles that shape how we grow, serve, and create long-term value for every partnership we build.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <motion.article
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="vision-card relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-[#d6ddff] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(234,240,255,0.96)_100%)] p-7 shadow-[0_20px_48px_rgba(10,11,133,0.12)] md:min-h-[420px] md:p-9"
          >
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#bac9ff]/45 blur-3xl" />
            <div className="absolute inset top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="mt-4 text-3xl font-bold text-[rgba(13,27,94)]">Vision</h3>
                </div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.35)], transparent text-[rgba(13,27,94)] shadow-[0_16px_28px_rgba(10,11,133,0.22)]">
                  <Eye size={24} />
                </span>
              </div>

              <div className="mt-8 h-px w-full bg-[linear-gradient(90deg,rgba(10,11,133,0.18),rgba(10,11,133,0.04))]" />

              <p className="relative mt-8 text-[15px] leading-8 font-semibold text-[#111827]/82 md:text-base">
                {vision}
              </p>

              <div className="mt-auto pt-8">
                <div className="rounded-2xl border border-[#0a0b85]/10 bg-white/80 px-4 py-3 text-left text-sm font-semibold text-[#111827]/82 shadow-[0_10px_24px_rgba(10,11,133,0.06)]">
                  A long-view perspective that keeps our innovation aligned with client growth.
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="vision-card relative flex min-h-[360px] flex-col overflow-hidden rounded-[2rem] border border-[#d6ddff] bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-7 text-white shadow-[0_24px_54px_rgba(10,11,133,0.26)] md:min-h-[420px] md:p-9"
          >
            <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="mt-4 text-3xl font-black text-white">Mission</h3>
                </div>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white shadow-[0_16px_28px_rgba(0,0,0,0.16)] ring-1 ring-white/15">
                  <Target size={24} />
                </span>
              </div>

              <div className="mt-8 h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.28),rgba(255,255,255,0.06))]" />

              <p className="relative mt-8 text-[15px] leading-8 font-semibold text-white md:text-base">
                {mission}
              </p>

              <div className="mt-auto pt-8">
                <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-left text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.14)] backdrop-blur-sm">
                  A practical commitment to service excellence, partnership, and measurable impact.
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}