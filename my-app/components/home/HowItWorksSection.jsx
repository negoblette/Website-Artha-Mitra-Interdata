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
    <div className="relative mx-auto h-[180px] w-[180px] sm:h-[280px] sm:w-[280px] lg:h-[340px] lg:w-[340px]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-[#eef0ff] to-[#c8c3ff] shadow-[0_28px_70px_rgba(71,60,182,0.2)]" />
      <div className="absolute inset-[10px] rounded-full border border-white/80 bg-gradient-to-br from-[#fcfcff] to-[#d8d4ff]" />
      <div className="absolute bottom-[16px] left-[16px] right-[16px] top-[16px] overflow-hidden rounded-full shadow-inner">
        <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-gradient-to-br from-[#5948d4] via-[#080d63] to-[#080d63]" />
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
    <div className="flex items-center gap-3 sm:gap-4 px-3 py-2.5 sm:px-5 sm:py-4">
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[rgba(120,103,255,0.1)] text-[#2f2d9f] shadow-[inset_0_0_0_1px_rgba(120,103,255,0.08)]">
        <Icon size={20} strokeWidth={2.1} className="sm:hidden" />
        <Icon size={23} strokeWidth={2.1} className="hidden sm:block" />
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-[1.95rem] font-black leading-none tracking-[-0.04em] text-[#0d1364]">
          {stat.value}
        </p>
        <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-medium leading-tight text-[#1f2a59]">
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
     <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-[8%] top-10 h-28 rounded-full bg-[radial-gradient(circle,rgba(95,80,255,0.12),transparent_72%)] blur-3xl" />
        <div className="absolute left-[-20px] top-[26%] h-[58%] w-[51%] rounded-r-[3rem] bg-[linear-gradient(180deg,rgba(108,94,255,0.08),rgba(108,94,255,0.14))]" />
        <div className="absolute left-1/2 top-[18%] h-[56%] w-[19%] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(136,126,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="absolute right-[2%] top-[20%] h-[53%] w-[24%] rounded-[2.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(120,103,255,0.04),rgba(255,255,255,0))]" />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <h2 className="mx-auto max-w-5xl text-center text-2xl sm:text-4xl font-black tracking-[-0.05em] text-[#080d63] lg:text-[4.2rem] lg:leading-[1.05]">
          {data.title}
        </h2>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_minmax(380px,1.2fr)_1fr] lg:gap-8 xl:gap-10">
          <article className="w-full px-1 sm:px-2 lg:pr-1 xl:pr-[1px]">

            <h3 className="max-w-none text-xl sm:text-3xl font-black leading-[1.18] tracking-[-0.04em] text-[#0d1364] lg:text-[2.25rem]">
              {left.title}
            </h3>
            <p className="mt-4 sm:mt-6 max-w-none text-black font-semibold text-sm sm:text-lg leading-[1.5] text-[#111827] text-justify">
              {left.description}
            </p>
          </article>

          {/* Center visualization - hidden on mobile, shown on lg+ */}
          <div className="relative hidden lg:flex min-h-[430px] items-center justify-center sm:min-h-[520px] lg:min-h-[600px]">
            <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,103,255,0.18),rgba(120,103,255,0.03)_55%,transparent_72%)] blur-2xl" />

            <div className="absolute left-[8%] top-[14%] rounded-[2rem] bg-[linear-gradient(180deg,#080d63,#2e277b)] p-5 text-white shadow-[0_28px_50px_rgba(54,43,156,0.32)]">
              <Cloud size={58} strokeWidth={1.8} />
            </div>

            <div className="absolute left-[6%] top-[36%] rounded-[2rem] bg-[linear-gradient(180deg,#080d63,#2e277b)] p-5 text-white shadow-[0_26px_44px_rgba(52,41,150,0.34)]">
              <div className="space-y-2.5">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="flex w-[92px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                  >
                    <div className="h-3 w-3 rounded-full bg-white" />
                    <div className="h-1.5 flex-1 rounded-full bg-white/50" />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute left-[14%] top-[72%] rounded-2xl bg-[linear-gradient(180deg,#080d63,#2e277b)] p-3 text-white shadow-[0_18px_30px_rgba(69,58,174,0.26)]">
              <Cog size={36} strokeWidth={2} />
            </div>

            <div className="absolute right-[16%] top-[18%] rounded-[2rem] bg-white/80 p-5 text-[#080d63] shadow-[0_24px_50px_rgba(80,69,175,0.14)] backdrop-blur-sm">
              <ChartColumnIncreasing size={78} strokeWidth={1.8} />
            </div>

            <div className="absolute right-[7%] top-[34%] rounded-[2rem] bg-white/85 p-4 text-[#080d63] shadow-[0_22px_44px_rgba(80,69,175,0.16)] backdrop-blur-sm">
              <Target size={52} strokeWidth={2} />
            </div>

            <div className="absolute right-[7%] top-[59%] rotate-[-10deg] rounded-[2rem] bg-[linear-gradient(180deg,#fefeff,#d9d5ff)] p-4 shadow-[0_30px_55px_rgba(86,74,184,0.18)]">
              <LaptopMinimal size={94} strokeWidth={1.6} className="text-[#080d63]" />
            </div>

            <div className="absolute inset-x-[24%] top-[34%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(98,87,220,0.5),transparent)] lg:block" />
            <div className="absolute inset-x-[20%] top-[67%] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(98,87,220,0.35),transparent)] lg:block" />
            <div className="absolute left-1/2 top-[30%] hidden h-[44%] w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(98,87,220,0.35),transparent)] lg:block" />

            <div className="absolute left-[30%] top-[28%] h-2.5 w-2.5 rounded-full bg-[#c2b8ff] shadow-[0_0_18px_rgba(120,103,255,0.9)]" />
            <div className="absolute right-[27%] top-[48%] h-2.5 w-2.5 rounded-full bg-[#c2b8ff] shadow-[0_0_18px_rgba(120,103,255,0.8)]" />
            <div className="absolute bottom-[17%] left-[34%] h-2.5 w-2.5 rounded-full bg-[#c2b8ff] shadow-[0_0_18px_rgba(120,103,255,0.8)]" />

            <PuzzleDisk />
          </div>

          {/* Mobile-only simplified puzzle disk */}
          <div className="relative flex lg:hidden min-h-[220px] items-center justify-center">
            <div className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,103,255,0.12),transparent_72%)] blur-2xl" />
            <PuzzleDisk />
          </div>

          <article className="w-full px-1 sm:px-2 lg:justify-self-end lg:pl-2 lg:pr-1 xl:pl-3 xl:pr-2">
            <h3 className="max-w-none text-xl sm:text-3xl font-black leading-[1.18] tracking-[-0.04em] text-[#0d1364] lg:text-[2.25rem]">
              {right.title}
            </h3>
            <p className="mt-4 sm:mt-6 max-w-none text-black font-semibold text-sm sm:text-lg leading-[1.5] text-[#111827] text-justify">
              {right.description}
            </p>
          </article>
        </div>

        <div className="mt-8 lg:mt-6 mx-0 rounded-2xl sm:rounded-[2rem] border border-[rgba(92,77,220,0.08)] bg-white/85 px-3 py-4 sm:px-6 sm:py-6 shadow-[0_24px_60px_rgba(46,34,125,0.08)] backdrop-blur-sm lg:-mx-8 lg:px-8 xl:-mx-14">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_2fr] lg:items-center lg:gap-8">
            <div>
              <h3 className="mt-1 sm:mt-3 text-xl sm:text-3xl font-black tracking-[-0.04em] text-[#0d1364] lg:text-[2.5rem]">
                Driving Value Through Optimization
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4 xl:gap-0">
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
}
