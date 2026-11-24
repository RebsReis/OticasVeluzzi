import type { FrameShape, Product } from '@/lib/data';

/**
 * Ilustração provisória da armação, desenhada em SVG a partir dos dados do produto.
 * Substituída pelas fotografias reais assim que forem enviadas (campo images[] na API).
 */
const lensPath: Record<FrameShape, string> = {
  redondo: 'M -52 0 A 52 52 0 1 0 52 0 A 52 52 0 1 0 -52 0 Z',
  quadrado: 'M -56 -30 Q -56 -46 -40 -46 L 40 -46 Q 56 -46 56 -30 L 56 26 Q 56 44 38 44 L -38 44 Q -56 44 -56 26 Z',
  retangular: 'M -60 -22 Q -60 -36 -46 -36 L 46 -36 Q 60 -36 60 -22 L 60 20 Q 60 36 44 36 L -44 36 Q -60 36 -60 20 Z',
  gatinho: 'M -58 -16 C -58 -40 -30 -42 0 -40 C 30 -38 54 -48 66 -54 C 64 -28 60 10 40 32 C 22 48 -30 48 -48 30 C -60 16 -58 4 -58 -16 Z',
  aviador: 'M -56 -36 C -20 -46 40 -46 58 -34 C 64 -8 50 30 20 46 C 0 54 -40 46 -54 20 C -62 4 -62 -24 -56 -36 Z',
  hexagonal: 'M -60 0 L -32 -42 L 32 -42 L 60 0 L 32 42 L -32 42 Z',
};

const strokeByMaterial = { Acetato: 11, TR90: 9, Metal: 4, Titânio: 3 } as const;
const tones = ['#EAE4D8', '#E4E3DB', '#DEDBCF', '#EDE7DC', '#E3DED2', '#E8E6DF'];

export function toneFor(p: Pick<Product, 'id'>) {
  return tones[Number(p.id) % tones.length];
}

export default function FrameArt({
  product,
  colorIndex = 0,
  view = 'front',
  className = '',
  title,
  bare = false,
}: {
  product: Product;
  colorIndex?: number;
  view?: 'front' | 'detail' | 'top';
  className?: string;
  title?: string;
  bare?: boolean;
}) {
  const col = product.colors[colorIndex] ?? product.colors[0];
  const sw = strokeByMaterial[product.material];
  const isSun = product.category === 'sol';
  const lensOpacity = isSun ? 0.92 : 0.45;
  const d = lensPath[product.shape];
  const uid = `${product.id}-${colorIndex}-${view}`;
  const bg = toneFor(product);

  const transform =
    view === 'detail' ? 'translate(90 230) scale(2.15) rotate(-6)' : view === 'top' ? 'translate(200 210) scale(0.82) rotate(-9)' : 'translate(200 196) scale(0.8)';

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={title ?? `${product.name} — ${col.name}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`bg-${uid}`} cx="50%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#FBFAF6" />
          <stop offset="100%" stopColor={bg} />
        </radialGradient>
        <linearGradient id={`lens-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={col.lens} stopOpacity={isSun ? 0.75 : 0.25} />
          <stop offset="100%" stopColor={col.lens} stopOpacity={lensOpacity} />
        </linearGradient>
        <filter id={`sh-${uid}`} x="-20%" y="-20%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      {!bare && <rect width="400" height="400" fill={`url(#bg-${uid})`} />}
      {!bare && view !== 'detail' && <ellipse cx="200" cy={view === 'top' ? 300 : 286} rx="150" ry="12" fill="#20221E" opacity="0.10" filter={`url(#sh-${uid})`} />}
      <g transform={transform}>
        {/* hastes */}
        <path d={`M -136 -22 L -150 -18 M 136 -22 L 150 -18`} stroke={col.frame} strokeWidth={sw * 0.8} strokeLinecap="round" />
        {/* ponte */}
        <path d="M -20 -20 Q 0 -34 20 -20" fill="none" stroke={col.frame} strokeWidth={Math.max(sw * 0.7, 3)} strokeLinecap="round" />
        {product.material === 'Metal' || product.material === 'Titânio' ? (
          <g fill="none" stroke={col.frame} strokeWidth="1.6" opacity="0.8">
            <ellipse cx="-24" cy="10" rx="4" ry="7" />
            <ellipse cx="24" cy="10" rx="4" ry="7" />
          </g>
        ) : null}
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${side * 78} 0) scale(${side} 1)`}>
            <path d={d} fill={`url(#lens-${uid})`} />
            <path d={d} fill="none" stroke={col.frame} strokeWidth={sw} strokeLinejoin="round" />
            {/* reflexo suave */}
            <path d="M -30 -24 Q -12 -34 8 -30" fill="none" stroke="#fff" strokeOpacity={isSun ? 0.35 : 0.7} strokeWidth="5" strokeLinecap="round" />
            {/* dobradiça */}
            <rect x="56" y="-26" width="12" height="8" rx="2" fill={col.frame} />
          </g>
        ))}
      </g>
    </svg>
  );
}
