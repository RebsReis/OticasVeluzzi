import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import LensFlow from '@/components/LensFlow';
import { getProduct, products } from '@/lib/data';

export function generateStaticParams() {
  return products.filter((p) => p.lensCompatible).map((p) => ({ slug: p.slug }));
}

export const metadata = { title: 'Monte seus óculos', robots: { index: false } };

export default async function LensPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p || !p.lensCompatible) notFound();
  return (
    <Suspense fallback={<div className="container-v py-20"><div className="skeleton h-12 w-64" /></div>}>
      <LensFlow product={p} />
    </Suspense>
  );
}
