import { getContent } from '@/lib/content';
import InsightHero from '@/components/insight/InsightHero';
import ArticlesSection from '@/components/insight/ArticlesSection';
import InsightNewsSection from '@/components/insight/InsightNewsSection';

export const metadata = {
  title: 'Insight — Artha Mitra Interdata',
  description: 'Articles, news, and insights about IT infrastructure, cybersecurity, and technology trends from Artha Mitra Interdata.',
};

export default function InsightPage() {
  // Ambil semua konten halaman Insight dari data JSON melalui helper content.
  const data = getContent('insight');

  return (
    <>
      {/* Section hero utama halaman Insight. */}
      <InsightHero data={data.hero} />

      {/* Section artikel dengan featured article, filter kategori, dan pagination. */}
      <ArticlesSection data={data.articles} />

      {/* Section news/latest updates dengan filter kategori dan pagination. */}
      <InsightNewsSection data={data.news} />
    </>
  );
}
