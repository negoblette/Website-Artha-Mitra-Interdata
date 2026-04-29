import { getContent } from '@/lib/content';
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
  const products = getContent('products');

  return (
    <div className="relative z-10">
      <SolutionHero data={data.hero} />
      <SolutionGrid solutions={data.solutions} />
      <ServicesGrid services={data.services} />
      <WhyChoose data={products.whyChoose} />
    </div>
  );
}
