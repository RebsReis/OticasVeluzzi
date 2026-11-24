import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.oticasveluzzi.com.br';
export default function robots(): MetadataRoute.Robots {
  // Protótipo de apresentação: bloqueia indexação. Para o site oficial, defina NEXT_PUBLIC_ALLOW_INDEX=1.
  if (process.env.NEXT_PUBLIC_ALLOW_INDEX !== '1') return { rules: [{ userAgent: '*', disallow: '/' }] };
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/checkout', '/carrinho', '/conta'] }], sitemap: `${site}/sitemap.xml` };
}
