import { getContent } from '@/lib/content';
import SolutionHero from '@/components/solution/SolutionHero';
import SolutionServicesGrid from '@/components/solution/SolutionServicesGrid';
import WhyChoose from '@/components/products/WhyChoose';

export const metadata = {
  title: 'Solutions & Services — Artha Mitra Interdata',
  description: 'Explore our IT infrastructure and security solutions, professional services, and technology partnerships.',
};

export default function SolutionPage() {
  const data = getContent('solution');
  const products = getContent('products');

  return (
    <>
      <SolutionHero data={data.hero} />
      <SolutionServicesGrid solutions={data.solutions} services={data.services} />
      <WhyChoose data={products.whyChoose} />
    </>
  );
}
