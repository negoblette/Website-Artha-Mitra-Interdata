import { getContent } from '@/lib/content';
import AboutHero from '@/components/about/AboutHero';
import VisionMission from '@/components/about/VisionMission';
import HistorySection from '@/components/about/HistorySection';
import AchievementSection from '@/components/about/AchievementSection';
import LifeAtAmi from '@/components/about/LifeAtAmi';
import CareersSection from '@/components/about/CareersSection';

export const metadata = {
  title: 'About Us — Artha Mitra Interdata',
  description: 'Learn about our vision, mission, history, and the team behind AMI.',
};

export default function AboutPage() {
  const data = getContent('about');

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-0 h-[max(100vh,700px)] bg-[linear-gradient(to_top,#e0e4f8_75%,#ffffff_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[max(100vh,700px)] z-0 h-[calc(100vh+7rem)] bg-[linear-gradient(to_bottom,#e0e4f8_0%,#ffffff_100%)]"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1]" aria-hidden="true">
          <img
            src="/decor/aboutheroelements.svg"
            alt=""
            className="absolute left-0 top-0 h-[1100px] w-full object-cover object-top opacity-100 md:h-[1250px] lg:h-[1400px]"
          />
        </div>

        <div className="relative z-[2]">
          <AboutHero data={data.hero} />
          <VisionMission vision={data.vision} mission={data.mission} />
        </div>
      </div>

      <div className="relative">
        <HistorySection data={data.history} />
        <AchievementSection data={data.achievement} />
        <LifeAtAmi data={data.lifeAtAmi} />
        <CareersSection data={data.careers} />
      </div>
    </div>
  );
}
