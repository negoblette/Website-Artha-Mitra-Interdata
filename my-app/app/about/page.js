import { getContent } from '@/lib/content';
import { isSectionVisible } from '@/lib/sectionVisibility';
import AboutHero from '@/components/about/AboutHero';
import VisionMission from '@/components/about/VisionMission';
import CiptaValuesSection from '@/components/about/CiptaValuesSection';
import HistorySection from '@/components/about/HistorySection';
import AchievementSection from '@/components/about/AchievementSection';
import LifeAtAmi from '@/components/about/LifeAtAmi';
import CareersSection from '@/components/about/CareersSection';

export const metadata = {
  title: 'About Artha Mitra Interdata',
  description: 'Learn about our vision, mission, history, and the team behind AMI.',
};

export default function AboutPage() {
  const data = getContent('about');

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f4f8]">
      {/* Page background - subtle */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: "url('/images/reference/about-page-background.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      />
      <div className="relative z-10">
        {isSectionVisible(data, 'hero') && <AboutHero data={data.hero} />}
        {isSectionVisible(data, 'vision') && isSectionVisible(data, 'mission') && <VisionMission vision={data.vision} mission={data.mission} />}
        {isSectionVisible(data, 'coreValues') && <CiptaValuesSection values={data.coreValues?.values} />}
        {isSectionVisible(data, 'history') && <HistorySection data={data.history} />}
        {isSectionVisible(data, 'achievement') && <AchievementSection data={data.achievement} />}
        {isSectionVisible(data, 'lifeAtAmi') && <LifeAtAmi data={data.lifeAtAmi} />}
        {isSectionVisible(data, 'careers') && <CareersSection data={data.careers} />}
      </div>
    </div>
  );
}
