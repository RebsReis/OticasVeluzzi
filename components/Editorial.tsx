import FrameArt from './FrameArt';
import type { Product } from '@/lib/data';

/**
 * Cena editorial provisória (luz difusa, pedra, oliva e areia — seção 07 do DS).
 * Ocupa o lugar das fotografias de campanha até o envio das imagens reais.
 */
export function EditorialScene({
  product,
  colorIndex = 0,
  tone = 'olive',
  className = '',
  label = true,
}: {
  product: Product;
  colorIndex?: number;
  tone?: 'olive' | 'sand' | 'stone';
  className?: string;
  label?: boolean;
}) {
  const palette = {
    olive: { from: '#5C6053', to: '#36392F', disc: '#B89A65', plinth: ['#D9D3C4', '#B9B2A1'] },
    sand: { from: '#EFE8DA', to: '#D9CEB8', disc: '#F7F1E4', plinth: ['#F4EFE6', '#D5CCBA'] },
    stone: { from: '#E7E6E0', to: '#C9C8BE', disc: '#F4E8C5', plinth: ['#4E5146', '#36392F'] },
  }[tone];
  return (
    <div className={`${/\babsolute\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`} style={{ background: `radial-gradient(120% 90% at 70% 20%, ${palette.from}, ${palette.to})` }}>
      {/* disco de luz */}
      <div className="absolute left-1/2 top-[14%] aspect-square w-[58%] -translate-x-1/2 rounded-full opacity-60 blur-[2px]" style={{ background: `radial-gradient(circle at 40% 35%, ${palette.disc}, transparent 70%)` }} />
      {/* sombra de janela */}
      <div className="absolute -right-[10%] top-0 h-full w-[45%] -skew-x-12 bg-white/5" />
      {/* pedestal de pedra */}
      <div className="absolute bottom-0 left-1/2 h-[30%] w-[70%] -translate-x-1/2 rounded-t-[50%/14%]" style={{ background: `linear-gradient(180deg, ${palette.plinth[0]}, ${palette.plinth[1]})`, boxShadow: '0 -10px 40px rgba(0,0,0,.12)' }} />
      <div data-parallax className="absolute inset-x-[8%] bottom-[20%] top-[18%]">
        <FrameArt product={product} colorIndex={colorIndex} bare view="top" className="h-full w-full drop-shadow-[0_24px_24px_rgba(0,0,0,0.22)]" />
      </div>
      {label && <span className="absolute bottom-3 right-3 rounded-xs bg-black/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur">Imagem provisória</span>}
    </div>
  );
}
