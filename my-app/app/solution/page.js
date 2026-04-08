import { getContent } from '@/lib/content';
import SolutionHero from '@/components/solution/SolutionHero';
import SolutionGrid from '@/components/solution/SolutionGrid';
import ServicesGrid from '@/components/solution/ServicesGrid';
import WhyChoose from '@/components/products/WhyChoose';

export const metadata = {
  title: 'Solutions & Services — Artha Mitra Interdata',
  description: 'Explore our IT infrastructure and security solutions, professional services, and technology partnerships.',
};

export default function SolutionPage() {
  const data = getContent('solution');
  const products = getContent('products');

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/reference/solutionbackground.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
      }}
    >
      <div className="relative z-10">
        <SolutionHero data={data.hero} />
        <SolutionGrid solutions={data.solutions} />
        <ServicesGrid services={data.services} />
        <WhyChoose data={products.whyChoose} />
      </div>
    </div>
      
      //-- buat background image di section, biar ga terlalu berat, buat 1 section aja yang full width, terus kasih background image, terus section lain di atasnya transparan, jadi background image nya keliatan terus, tapi ga terlalu berat karena cuma 1 image doang, terus kasih overlay gelap biar text nya tetep keliatan jelas--//

    // <>
    //   <SolutionHero data={data.hero} />
    //   <SolutionGrid solutions={data.solutions} />
    //   <ServicesGrid services={data.services} />
    //   <WhyChoose data={products.whyChoose} />
    // </>
  );
}
