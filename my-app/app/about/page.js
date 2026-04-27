import { getContent } from '@/lib/content';
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
  const homepage = getContent('homepage');

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#f3f4f8]"
      style={{
        backgroundImage: "url('/images/reference/about-page-background.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
      }}
    >
      <div className="relative z-10">
        <AboutHero data={data.hero} />
        <VisionMission vision={data.vision} mission={data.mission} />
        <CiptaValuesSection values={homepage.howItWorks?.values} />
        <HistorySection data={data.history} />
        <AchievementSection data={data.achievement} />
        <LifeAtAmi data={data.lifeAtAmi} />
        <CareersSection data={data.careers} />
      </div>
    </div>
  );
}
