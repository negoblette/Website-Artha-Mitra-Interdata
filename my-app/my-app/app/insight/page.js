import { getContent } from '@/lib/content';
import InsightHero from '@/components/insight/InsightHero';
import ArticlesSection from '@/components/insight/ArticlesSection';
import InsightNewsSection from '@/components/insight/InsightNewsSection';

export const metadata = {
  title: 'Insight — Artha Mitra Interdata',
  description: 'Articles, news, and insights about IT infrastructure, cybersecurity, and technology trends from Artha Mitra Interdata.',
};

export default function InsightPage() {
  const data = getContent('insight');

  return (
    <>
      <InsightHero data={data.hero} />
      <ArticlesSection data={data.articles} />
      <InsightNewsSection data={data.news} />
    </>
  );
}
