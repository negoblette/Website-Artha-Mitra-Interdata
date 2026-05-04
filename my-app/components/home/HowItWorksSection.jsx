import {
  ArrowUpRight,
  ChartColumnIncreasing,
  CircleGauge,
  Cloud,
  Cog,
  LaptopMinimal,
  ShieldCheck,
  Target,
  Users,
  Headset,
} from "lucide-react";

const statIcons = [ChartColumnIncreasing, Users, ShieldCheck, Headset];

function splitLabel(label) {
  const words = label.split(" ");
  if (words.length <= 2) return [label];

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function PuzzleDisk() {
  return (
    <div className="relative mx-auto h-[220px] w-[220px] sm:h-[280px] sm:w-[280px] lg:h-[340px] lg:w-[340px]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-[#eef0ff] to-[#c8c3ff] shadow-[0_28px_70px_rgba(71,60,182,0.2)]" />
      <div className="absolute inset-[10px] rounded-full border border-white/80 bg-gradient-to-br from-[#fcfcff] to-[#d8d4ff]" />
      <div className="absolute bottom-[16px] left-[16px] right-[16px] top-[16px] overflow-hidden rounded-full shadow-inner">
        <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-gradient-to-br from-[#7f70ff] via-[#5948d4] to-[#3f33b0]" />
        <div className="absolute inset-y-0 right-0 w-1/2 rounded-r-full bg-gradient-to-br from-[#fcfcff] via-[#f0efff] to-[#d7d3ff]" />

        <div className="absolute left-1/2 top-1/2 h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5f5ff] shadow-[0_0_0_10px_rgba(255,255,255,0.9)]" />

        <div className="absolute left-[calc(50%-14px)] top-[36px] h-[44px] w-[28px] rounded-b-full bg-[#4c3cc0]" />
        <div className="absolute bottom-[36px] left-[calc(50%-14px)] h-[44px] w-[28px] rounded-t-full bg-[#ffffff]" />
        <div className="absolute left-[70px] top-[calc(50%-14px)] h-[28px] w-[44px] rounded-r-full bg-[#6d5cf1]" />
        <div className="absolute right-[70px] top-[calc(50%-14px)] h-[28px] w-[44px] rounded-l-full bg-[#ece9ff]" />

        <div className="absolute inset-y-[12%] left-1/2 w-px -translate-x-1/2 bg-[rgba(90,72,215,0.2)]" />
        <div className="absolute left-[12%] right-[12%] top-1/2 h-px -translate-y-1/2 bg-[rgba(90,72,215,0.16)]" />
      </div>
    </div>
  );
}

function StatsCard({ stat, index }) {
  const Icon = statIcons[index] ?? CircleGauge;
  const labelLines = splitLabel(stat.label);

  return (
    <div className="flex items-center gap-4 px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(120,103,255,0.1)] text-[#2f2d9f] shadow-[inset_0_0_0_1px_rgba(120,103,255,0.08)]">
        <Icon size={23} strokeWidth={2.1} />
      </div>
      <div className="min-w-0">
        <p className="text-[1.95rem] font-black leading-none tracking-[-0.04em] text-[#0d1364]">
          {stat.value}
        </p>
        <div className="mt-1 text-sm font-medium leading-tight text-[#1f2a59]">
          {labelLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection({ data }) {
  const left = data.left ?? {
    title: "",
    description: data.description?.split("\n\n")?.[0] ?? "",
  };
  const right = data.right ?? {
    title: "",
    description: data.description?.split("\n\n")?.[1] ?? "",
  };

  return (
    <section className="relative overflow-hidden bg-white px-6 py-2 sm:px-8 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-[8%] top-10 h-28 rounded-full bg-[radial-gradient(circle,rgba(95,80,255,0.12),transparent_72%)] blur-3xl" />
        <div className="absolute left-[-20px] top-[26%] h-[58%] w-[51%] rounded-r-[3rem] bg-[linear-gradient(180deg,rgba(108,94,255,0.08),rgba(108,94,255,0.14))]" />
        <div className="absolute left-1/2 top-[18%] h-[56%] w-[19%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(136,126,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="absolute right-[2%] top-[20%] h-[53%] w-[24%] rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(120,103,255,0.04),rgba(255,255,255,0))]" />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <h2 className="translate-y-18 mx-auto max-w-5xl text-center text-4xl font-black tracking-[-0.05em] text-[#080d63] sm:text-5xl lg:text-[4.2rem] lg:leading-[1.05]">
          {data.title}
        </h2>

        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1fr_minmax(380px,1.2fr)_1fr] lg:gap-8 xl:gap-10">
          <article className="max-w-md lg:pl-2 xl:-ml-5">
            <div className="mb-6 h-24 w-56 rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(108,94,255,0.08),rgba(108,94,255,0.04))]" />
            <h3 className="max-w-md text-3xl font-black leading-[1.18] tracking-[-0.04em] text-[#0d1364] sm:text-[2.25rem]">
              {left.title}
            </h3>
            <p className="mt-6 max-w-md text-black font-semibold text-lg leading-[1.5] text-[#111827]">
              {left.description}
            </p>
          </article>

          <div className="relative flex min-h-[430px] items-center justify-center sm:min-h-[520px] lg:min-h-[600px]">
            <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,103,255,0.18),rgba(120,103,255,0.03)_55%,transparent_72%)] blur-2xl" />

            <div className="absolute left-[8%] top-[14%] rounded-[2rem] bg-[linear-gradient(180deg,#6354db,#2e277b)] p-5 text-white shadow-[0_28px_50px_rgba(54,43,156,0.32)]">
              <Cloud size={58} strokeWidth={1.8} />
            </div>

            <div className="absolute left-[6%] top-[36%] rounded-[2rem] bg-[linear-gradient(180deg,#5043bf,#241f69)] p-5 text-white shadow-[0_26px_44px_rgba(52,41,150,0.34)]">
              <div className="space-y-2.5">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="flex w-[92px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="h-3 w-3 rounded-full bg-[#9d92ff]" />
                    <div className="h-1.5 flex-1 rounded-full bg-white/50" />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute left-[14%] top-[72%] rounded-2xl bg-[linear-gradient(180deg,#6f60f2,#4739bf)] p-3 text-white shadow-[0_18px_30px_rgba(69,58,174,0.26)]">
              <Cog size={36} strokeWidth={2} />
            </div>

            <div className="absolute right-[16%] top-[18%] rounded-[2rem] bg-white/80 p-5 text-[#745eff] shadow-[0_24px_50px_rgba(80,69,175,0.14)] backdrop-blur-sm">
              <ChartColumnIncreasing size={78} strokeWidth={1.8} />
            </div>

            <div className="absolute right-[7%] top-[34%] rounded-[2rem] bg-white/85 p-4 text-[#6d56ff] shadow-[0_22px_44px_rgba(80,69,175,0.16)] backdrop-blur-sm">
              <Target size={52} strokeWidth={2} />
            </div>

            <div className="absolute right-[7%] top-[59%] rotate-[-10deg] rounded-[2rem] bg-[linear-gradient(180deg,#fefeff,#d9d5ff)] p-4 shadow-[0_30px_55px_rgba(86,74,184,0.18)]">
              <LaptopMinimal size={94} strokeWidth={1.6} className="text-[#5f4ce1]" />
            </div>

            <div className="absolute inset-x-[24%] top-[34%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(98,87,220,0.5),transparent)] lg:block" />
            <div className="absolute inset-x-[20%] top-[67%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(98,87,220,0.35),transparent)] lg:block" />
            <div className="absolute left-1/2 top-[30%] hidden h-[44%] w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(98,87,220,0.35),transparent)] lg:block" />

            <div className="absolute left-[30%] top-[28%] h-2.5 w-2.5 rounded-full bg-[#c2b8ff] shadow-[0_0_18px_rgba(120,103,255,0.9)]" />
            <div className="absolute right-[27%] top-[48%] h-2.5 w-2.5 rounded-full bg-[#c2b8ff] shadow-[0_0_18px_rgba(120,103,255,0.8)]" />
            <div className="absolute bottom-[17%] left-[34%] h-2.5 w-2.5 rounded-full bg-[#c2b8ff] shadow-[0_0_18px_rgba(120,103,255,0.8)]" />

            <PuzzleDisk />
          </div>

          <article className="max-w-md lg:justify-self-end lg:pr-2 xl:-mr-5">
            
            <h3 className="max-w-md mt-14 text-3xl font-black leading-[1.18] tracking-[-0.04em] text-[#0d1364] sm:text-[2.25rem]">
              {right.title}
            </h3>
            <p className="mt-6 max-w-md text-black font-semibold text-lg leading-[1.5] text-[#111827]">
              {right.description}
            </p>
          </article>
        </div>

        <div className="mt-10 -mx-14 rounded-[2rem] border border-[rgba(92,77,220,0.08)] bg-white/85 px-4 py-6 shadow-[0_24px_60px_rgba(46,34,125,0.08)] backdrop-blur-sm sm:px-6 lg:mt-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_2fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.08em] text-[#6c58f8] sm:text-base">
                Our Commitment
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#0d1364] sm:text-[2.5rem]">
                Driving Value Through Optimization
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
              {data.stats?.map((stat, index) => (
                <div
                  key={`${stat.value}-${stat.label}`}
                  className="xl:border-l xl:border-[rgba(92,77,220,0.14)] first:xl:border-l-0"
                >
                  <StatsCard stat={stat} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );


  //  <section className="bg-transparent overflow-hidden py-10 md:py-14">
  //     <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
  //       <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[rgb(13,27,94)]">{data.title}</h2>
  //       <p className="mt-4 text-[rgb(13,27,94)] font-semibold text-lg sm:text-xl max-w-4xl mx-auto leading-snug">{data.description}</p>

        {/* <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
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
        </div> */}
  //     </div>
  //   </section>
  // );








}
