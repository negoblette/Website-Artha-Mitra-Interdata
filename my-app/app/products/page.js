import { getContent } from '@/lib/content';
import ProductsHero from '@/components/products/ProductsHero';
import ProductsCarousel from '@/components/products/ProductsCarousel';
import BrandGrid from '@/components/products/BrandGrid';

export const metadata = {
  title: 'Technology Partners — Artha Mitra Interdata',
  description: 'Discover our world-class technology partners and the solutions they power.',
};

export default function ProductsPage() {
  const data = getContent('products');

  return (
      <div 
        className="relative min-h-screen overflow-hidden"
        style={{
          backgroundImage: "url('/images/reference/products-page-background.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
        }}
      >
      <div className="relative z-10 flex flex-col gap-8">
      <ProductsHero data={data.hero} />
      <ProductsCarousel items={data.carousel} />
      <BrandGrid brands={data.brands} />
      </div>
    </div>
  );
}