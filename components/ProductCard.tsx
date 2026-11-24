'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import FrameArt from './FrameArt';
import { brl, discountPct, finalPrice, installments, type Product } from '@/lib/data';
import { useHydrated, useStore } from '@/lib/store';

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [color, setColor] = useState(0);
  const hydrated = useHydrated();
  const fav = useStore((s) => s.favorites.includes(product.slug));
  const toggleFav = useStore((s) => s.toggleFav);
  const add = useStore((s) => s.add);
  const price = finalPrice(product);
  const inst = installments(price);
  const off = discountPct(product);
  const soldOut = product.stock === 0;
  const href = `/produto/${product.slug}`;

  return (
    <article className="group relative flex h-full flex-col" data-reveal={priority ? undefined : ''}>
      <div className="relative overflow-hidden rounded-md bg-line/40">
        <Link href={href} className="block aspect-[4/5]" aria-label={`${product.name}, ${product.collection}`}>
          <FrameArt product={product} colorIndex={color} className="absolute inset-0 h-full w-full transition-transform duration-[400ms] ease-veluzzi group-hover:scale-[1.04]" />
          {/* segunda fotografia ao passar o mouse */}
          <FrameArt product={product} colorIndex={color} view="detail" className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[400ms] ease-veluzzi group-hover:opacity-100 max-md:hidden" title={`${product.name} — detalhe`} />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {off > 0 && <span className="rounded-xs bg-primary px-2 py-0.5 text-xs font-bold text-ink">−{off}%</span>}
          {product.isNew && <span className="rounded-xs bg-secondary px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">Novo</span>}
          {soldOut && <span className="rounded-xs bg-ink/80 px-2 py-0.5 text-xs font-semibold text-white">Esgotado</span>}
        </div>

        <button
          type="button"
          onClick={() => toggleFav(product.slug)}
          aria-pressed={hydrated && fav}
          aria-label={fav ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-surface/90 shadow-sm backdrop-blur transition-transform duration-[250ms] hover:scale-105"
        >
          <Heart size={18} className={hydrated && fav ? 'fill-primary stroke-primary' : 'stroke-ink'} />
        </button>

        {!soldOut && (
          <button
            type="button"
            onClick={() => add({ slug: product.slug, color })}
            className="btn btn-primary absolute inset-x-3 bottom-3 translate-y-[120%] opacity-0 transition-all duration-[400ms] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 max-md:hidden"
            style={{ minHeight: 44 }}
          >
            <ShoppingBag size={16} /> Adicionar à sacola
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow !text-[11px]">{product.collection}</p>
        <h3 className="mt-1 font-heading text-[20px] leading-tight">
          <Link href={href} className="hover:text-secondary">{product.name}</Link>
        </h3>

        <div className="mt-2 flex items-center gap-1.5" role="radiogroup" aria-label="Cores">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={color === i}
              aria-label={c.name}
              title={c.name}
              onClick={() => setColor(i)}
              className={`grid h-7 w-7 place-items-center rounded-full border transition ${color === i ? 'border-ink' : 'border-transparent'}`}
            >
              <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: `linear-gradient(135deg, ${c.frame} 50%, ${c.lens} 50%)` }} />
            </button>
          ))}
        </div>

        <div className="mt-auto pt-3">
          {product.salePrice && <p className="text-sm text-muted line-through">{brl(product.price)}</p>}
          <p className="text-[18px] font-bold">{brl(price)}</p>
          <p className="text-sm text-muted">
            ou {inst.n}x de {brl(inst.value)} sem juros
          </p>
        </div>

        <button
          type="button"
          disabled={soldOut}
          onClick={() => add({ slug: product.slug, color })}
          className="btn btn-outline mt-3 w-full md:hidden"
          style={{ minHeight: 44 }}
        >
          {soldOut ? 'Indisponível' : 'Comprar'}
        </button>
      </div>
    </article>
  );
}
