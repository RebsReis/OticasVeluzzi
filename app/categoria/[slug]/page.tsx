import { Suspense } from 'react';
import type { Metadata } from 'next';
import Catalog from '@/components/Catalog';
import { pageCategories } from '@/lib/data';

export function generateStaticParams() {
  return Object.keys(pageCategories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = pageCategories[slug] ?? pageCategories.todos;
  return { title: c.title, description: c.intro };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="container-v py-20"><div className="skeleton h-12 w-64" /></div>}>
      <Catalog slug={slug} />
    </Suspense>
  );
}
