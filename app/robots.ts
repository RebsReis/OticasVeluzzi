import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.oticasveluzzi.com.br';
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/checkout', '/carrinho', '/conta'] }], sitemap: `${site}/sitemap.xml` };
}
