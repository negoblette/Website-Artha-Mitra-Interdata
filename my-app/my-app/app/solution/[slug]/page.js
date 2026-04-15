import { getContent } from '@/lib/content';
import { notFound } from 'next/navigation';
import SolutionDetailClient from './SolutionDetailClient';

export function generateStaticParams() {
  const data = getContent('solution');
  return data.solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = getContent('solution');
  const solution = data.solutions.find((s) => s.slug === slug);
  if (!solution) return {};
  return {
    title: `${solution.name} — Artha Mitra Interdata`,
    description: solution.shortDescription,
  };
}

export default async function SolutionDetailPage({ params }) {
  const { slug } = await params;
  const data = getContent('solution');
  const solution = data.solutions.find((s) => s.slug === slug);

  if (!solution) notFound();

  return <SolutionDetailClient solution={solution} allSolutions={data.solutions} />;
}
