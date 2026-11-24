import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductView from '@/components/ProductView';
import { finalPrice, getProduct, products } from '@/lib/data';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.category === 'sol' ? 'Óculos de sol' : 'Óculos de grau'}`,
    description: p.description,
    openGraph: { title: `${p.name} | Óticas Veluzzi`, description: p.description, type: 'website' },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  // Dados estruturados (produto + breadcrumbs)
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      sku: p.sku,
      brand: { '@type': 'Brand', name: p.collection },
      material: p.material,
      description: p.description,
      offers: { '@type': 'Offer', priceCurrency: 'BRL', price: finalPrice(p).toFixed(2), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: '/' },
        { '@type': 'ListItem', position: 2, name: p.category === 'sol' ? 'Óculos de sol' : 'Óculos de grau', item: p.category === 'sol' ? '/categoria/oculos-de-sol' : '/categoria/oculos-de-grau' },
        { '@type': 'ListItem', position: 3, name: p.name },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <ProductView product={p} />
    </>
  );
}
