import { getContent } from '@/lib/content';
import { isSectionVisible } from '@/lib/sectionVisibility';
import SolutionHero from '@/components/solution/SolutionHero';
import SolutionGrid from '@/components/solution/SolutionGrid';
import ServicesGrid from '@/components/solution/ServicesGrid';
import WhyChoose from '@/components/solution/WhyChoose';

export const metadata = {
  title: 'Solutions & Services — Artha Mitra Interdata',
  description: 'Explore our IT infrastructure and security solutions, professional services, and technology partnerships.',
};

export default function SolutionPage() {
  const data = getContent('solution');

  return (
    <div className="relative z-10">
      {isSectionVisible(data, 'hero') && <SolutionHero data={data.hero} />}
      {isSectionVisible(data, 'solutions') && <SolutionGrid solutions={data.solutions} />}
      {isSectionVisible(data, 'services') && <ServicesGrid services={data.services} />}
      {isSectionVisible(data, 'whyChoose') && <WhyChoose data={data.whyChoose} />}
    </div>
  );
}
