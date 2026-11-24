import FrameArt, { toneFor } from './FrameArt';
import type { Product } from '@/lib/data';

/**
 * Imagem de produto: usa a fotografia cadastrada quando existe; caso contrário, a ilustração provisória.
 * As fotos (fundo branco) recebem mix-blend-multiply sobre o tom areia do Design System,
 * o que integra fotos de fornecedores diferentes à mesma estética.
 */
export default function ProductImage({
  product,
  colorIndex = 0,
  index = 0,
  view = 'front',
  className = '',
  eager = false,
}: {
  product: Product;
  colorIndex?: number;
  /** índice da foto (0 = principal) */
  index?: number;
  /** usado apenas pela ilustração */
  view?: 'front' | 'detail' | 'top';
  className?: string;
  eager?: boolean;
}) {
  const src = product.images?.[index];
  if (!src) return <FrameArt product={product} colorIndex={colorIndex} view={view} className={className} />;
  return (
    <div className={`${/\babsolute\b/.test(className) ? '' : 'relative'} ${className}`} style={{ background: `radial-gradient(circle at 50% 35%, #FBFAF6, ${toneFor(product)})` }}>
      <img
        src={src}
        alt={`${product.name} — ${product.colors[colorIndex]?.name ?? ''}${index ? ' (outro ângulo)' : ''}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain p-[8%] mix-blend-multiply"
      />
    </div>
  );
}

export const photoCount = (p: Product) => p.images?.length ?? 0;
