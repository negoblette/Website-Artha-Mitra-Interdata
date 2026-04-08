import { getContent } from '@/lib/content';
import ProductsHero from '@/components/products/ProductsHero';
import BrandGrid from '@/components/products/BrandGrid';

export const metadata = {
  title: 'Technology Partners — Artha Mitra Interdata',
  description: 'Discover our world-class technology partners and the solutions they power.',
};

export default function ProductsPage() {
  const data = getContent('products');

  return (
    <>
      <ProductsHero data={data.hero} />
      <BrandGrid brands={data.brands} />
    </>
  );
}
