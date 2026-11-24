import type { MetadataRoute } from 'next';
import { pageCategories, products } from '@/lib/data';
export const dynamic = 'force-static';
const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.oticasveluzzi.com.br';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site, priority: 1 },
    ...Object.keys(pageCategories).map((s) => ({ url: `${site}/categoria/${s}`, priority: 0.8 })),
    ...products.map((p) => ({ url: `${site}/produto/${p.slug}`, priority: 0.7 })),
  ];
}
