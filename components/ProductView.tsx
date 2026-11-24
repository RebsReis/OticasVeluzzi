'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Heart, ZoomIn, X, Check, Truck, ShieldCheck, RotateCcw, ChevronDown, Star, Glasses } from 'lucide-react';
import FrameArt from './FrameArt';
import ProductImage from './ProductImage';
import { ShippingCalc } from './CartParts';
import { Scroller } from './Shelf';
import { WhatsappIcon } from './Social';
import { brl, discountPct, finalPrice, installments, products, storeSettings, waLink, type Product } from '@/lib/data';
import { useHydrated, useStore } from '@/lib/store';

const views = [
  { id: 'front', label: 'Frente' },
  { id: 'top', label: 'Perspectiva' },
  { id: 'detail', label: 'Detalhe' },
] as const;

export function MeasureGuide({ p }: { p: Product }) {
  const m = p.measures;
  return (
    <figure className="rounded-md border border-line bg-surface p-5">
      <svg viewBox="0 0 420 210" className="w-full" role="img" aria-label={`Medidas: lente ${m.lens} mm, ponte ${m.bridge} mm, haste ${m.temple} mm`}>
        <g fill="none" stroke="#20221E" strokeWidth="3">
          <rect x="40" y="40" width="140" height="86" rx="22" />
          <rect x="240" y="40" width="140" height="86" rx="22" />
          <path d="M180 62 Q210 44 240 62" />
        </g>
        <g stroke="#B89A65" strokeWidth="1.5" fill="#B89A65" fontFamily="Manrope" fontSize="13" fontWeight="600">
          <line x1="40" y1="150" x2="180" y2="150" /><line x1="40" y1="144" x2="40" y2="156" /><line x1="180" y1="144" x2="180" y2="156" />
          <text x="110" y="172" textAnchor="middle" stroke="none" fill="#20221E">Lente {m.lens} mm</text>
          <line x1="184" y1="30" x2="236" y2="30" /><line x1="184" y1="24" x2="184" y2="36" /><line x1="236" y1="24" x2="236" y2="36" />
          <text x="210" y="18" textAnchor="middle" stroke="none" fill="#20221E">Ponte {m.bridge} mm</text>
          <line x1="396" y1="40" x2="396" y2="126" /><line x1="390" y1="40" x2="402" y2="40" /><line x1="390" y1="126" x2="402" y2="126" />
          <text x="404" y="200" textAnchor="end" stroke="none" fill="#20221E">Altura {m.height} mm</text>
        </g>
        <g>
          <line x1="40" y1="194" x2="250" y2="194" stroke="#20221E" strokeWidth="3" strokeLinecap="round" />
          <path d="M250 194 q18 0 24 10" stroke="#20221E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <text x="40" y="186" fontFamily="Manrope" fontSize="13" fontWeight="600" fill="#20221E">Haste {m.temple} mm</text>
        </g>
      </svg>
      <figcaption className="mt-3 text-xs leading-relaxed text-muted">
        Compare com um óculos que você já usa: as medidas costumam estar gravadas na parte interna da haste, na ordem lente–ponte–haste ({m.lens}□{m.bridge}-{m.temple}).
      </figcaption>
    </figure>
  );
}

function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [o, setO] = useState(open);
  return (
    <div className="border-b border-line">
      <button onClick={() => setO(!o)} aria-expanded={o} className="flex min-h-[56px] w-full items-center justify-between text-left font-bold">
        {title} <ChevronDown size={18} className={`transition-transform duration-300 ${o ? 'rotate-180' : ''}`} />
      </button>
      {o && <div className="pb-6 text-[15px] text-ink/80">{children}</div>}
    </div>
  );
}

export default function ProductView({ product: p }: { product: Product }) {
  const [color, setColor] = useState(0);
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [hoverZoom, setHoverZoom] = useState(false);
  const [showInst, setShowInst] = useState(false);
  const hydrated = useHydrated();
  const fav = useStore((s) => s.favorites.includes(p.slug));
  const toggleFav = useStore((s) => s.toggleFav);
  const add = useStore((s) => s.add);
  const openDrawer = useStore((s) => s.openDrawer);
  const router = useRouter();

  const price = finalPrice(p);
  const inst = installments(price);
  const off = discountPct(p);
  const soldOut = p.stock === 0;
  const related = products.filter((x) => x.id !== p.id && (x.category === p.category || x.collection === p.collection)).slice(0, 8);

  // Galeria: fotos reais quando houver; senão, 3 ângulos ilustrados
  const gallery = p.images?.length
    ? p.images.map((_, k) => ({ id: `foto-${k}`, label: k === 0 ? 'Foto principal' : `Foto ${k + 1}`, render: (cls: string) => <ProductImage product={p} colorIndex={color} index={k} eager={k === 0} className={cls} /> }))
    : views.map((v) => ({ id: v.id, label: v.label, render: (cls: string) => <FrameArt product={p} colorIndex={color} view={v.id} className={cls} /> }));
  const current = gallery[Math.min(view, gallery.length - 1)];

  const buyNow = () => { add({ slug: p.slug, color }); openDrawer(false); router.push('/checkout'); };
  const lensHref = `/produto/${p.slug}/lentes?cor=${color}`;

  return (
    <>
      <div className="container-v pb-[calc(var(--section-spacing)+80px)] pt-6 md:pb-[var(--section-spacing)]">
        <nav aria-label="Navegação estrutural" className="mb-6 text-xs text-muted">
          <ol className="flex flex-wrap gap-1.5">
            <li><Link href="/" className="hover:text-ink">Início</Link> /</li>
            <li><Link href={p.category === 'sol' ? '/categoria/oculos-de-sol' : '/categoria/oculos-de-grau'} className="hover:text-ink">{p.category === 'sol' ? 'Óculos de sol' : 'Óculos de grau'}</Link> /</li>
            <li aria-current="page" className="text-ink">{p.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          {/* Galeria */}
          <div className="lg:sticky lg:top-[calc(var(--header-height)+64px)] lg:self-start">
            <div className="flex flex-col-reverse gap-4 md:flex-row">
              <div className="flex gap-3 md:flex-col" role="tablist" aria-label="Fotos do produto">
                {gallery.length > 1 && gallery.map((g, k) => (
                  <button key={g.id} role="tab" aria-selected={view === k} aria-label={g.label} onClick={() => setView(k)} className={`h-20 w-20 flex-none overflow-hidden rounded-sm border-2 transition ${view === k ? 'border-secondary' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    {g.render('h-full w-full')}
                  </button>
                ))}
              </div>
              <div
                className="relative flex-1 cursor-zoom-in overflow-hidden rounded-xl"
                onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}
                onMouseEnter={() => setHoverZoom(true)}
                onMouseLeave={() => setHoverZoom(false)}
                onClick={() => setZoom(true)}
              >
                <div className="aspect-square transition-transform duration-[400ms] ease-veluzzi" style={{ transform: hoverZoom ? 'scale(1.8)' : 'none', transformOrigin: origin }}>
                  {current.render('h-full w-full')}
                </div>
                <button onClick={(e) => { e.stopPropagation(); setZoom(true); }} aria-label="Ampliar imagem" className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-surface shadow-md"><ZoomIn size={18} /></button>
              </div>
            </div>
          </div>

          {/* Informações */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{p.collection}</p>
                <h1 className="mt-2 text-h2">{p.name}</h1>
                <p className="mt-2 text-xs text-muted">Código: {p.sku}</p>
              </div>
              <button onClick={() => toggleFav(p.slug)} aria-pressed={hydrated && fav} aria-label="Favoritar" className="grid h-12 w-12 flex-none place-items-center rounded-full border border-line bg-surface hover:border-ink">
                <Heart size={20} className={hydrated && fav ? 'fill-primary stroke-primary' : ''} />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              {p.salePrice && <span className="text-muted line-through">{brl(p.price)}</span>}
              <span className="text-[32px] font-bold leading-none">{brl(price)}</span>
              {off > 0 && <span className="rounded-xs bg-primary px-2 py-0.5 text-xs font-bold">−{off}%</span>}
            </div>
            <p className="mt-2 text-[15px]">ou <b>{inst.n}x de {brl(inst.value)}</b> sem juros</p>
            <p className="text-[15px] text-success">{brl(price * (1 - storeSettings.pixDiscount))} no Pix ({storeSettings.pixDiscount * 100}% de desconto)</p>
            <button onClick={() => setShowInst(!showInst)} className="mt-1 text-sm font-semibold underline" aria-expanded={showInst}>Ver parcelas</button>
            {showInst && (
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 rounded-sm bg-surface p-4 text-sm">
                {Array.from({ length: inst.n }).map((_, k) => <li key={k} className="flex justify-between"><span>{k + 1}x</span><span>{brl(price / (k + 1))}</span></li>)}
              </ul>
            )}

            <div className="mt-8">
              <p className="text-sm font-bold">Cor: <span className="font-normal">{p.colors[color].name}</span></p>
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Cor">
                {p.colors.map((c, k) => (
                  <button key={c.name} role="radio" aria-checked={color === k} onClick={() => setColor(k)} className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm transition ${color === k ? 'border-ink bg-surface' : 'border-line hover:border-muted'}`}>
                    <span className="h-7 w-7 rounded-full border border-black/10" style={{ background: `linear-gradient(135deg, ${c.frame} 50%, ${c.lens} 50%)` }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <p className={`mt-6 flex items-center gap-2 text-sm font-semibold ${soldOut ? 'text-error' : p.stock <= 5 ? 'text-warning' : 'text-success'}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {soldOut ? 'Esgotado no momento' : p.stock <= 5 ? `Últimas ${p.stock} unidades` : 'Em estoque'}
            </p>

            <div className="mt-6 grid gap-3">
              {soldOut ? (
                <button disabled className="btn btn-secondary w-full">Indisponível</button>
              ) : p.lensCompatible ? (
                <>
                  <Link href={lensHref} className="btn btn-primary w-full"><Glasses size={18} /> Escolher lentes de grau</Link>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={buyNow} className="btn btn-outline !px-3">Comprar agora</button>
                    <button onClick={() => add({ slug: p.slug, color })} className="btn btn-outline !px-3">Só a armação</button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={buyNow} className="btn btn-primary w-full">Comprar agora</button>
                  <button onClick={() => add({ slug: p.slug, color })} className="btn btn-outline w-full">Adicionar à sacola</button>
                </>
              )}
              <a href={waLink(`Olá! Tenho interesse no modelo ${p.name} (${p.sku}) da Óticas Veluzzi.`)} target="_blank" rel="noopener noreferrer" className="btn w-full !min-h-[48px] border border-line bg-surface hover:border-ink"><WhatsappIcon /> Tirar dúvidas no WhatsApp</a>
            </div>

            <ul className="mt-8 grid gap-3 text-sm">
              <li className="flex gap-3"><Truck size={18} className="flex-none text-accent" /> Frete grátis acima de {brl(storeSettings.freeShippingFrom)}</li>
              <li className="flex gap-3"><RotateCcw size={18} className="flex-none text-accent" /> Troca e devolução conforme a política da loja</li>
              <li className="flex gap-3"><ShieldCheck size={18} className="flex-none text-accent" /> Garantia contra defeitos de fabricação</li>
            </ul>

            <div className="mt-8"><ShippingCalc subtotal={price} /></div>

            <div className="mt-10 border-t border-line">
              <Accordion title="Descrição" open><p>{p.description}</p></Accordion>
              <Accordion title="Medidas da armação" open><MeasureGuide p={p} /></Accordion>
              <Accordion title="Informações técnicas">
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                  {[['Material', p.material], ['Formato', p.shape[0].toUpperCase() + p.shape.slice(1)], ['Tamanho', p.size], ['Lente', p.category === 'sol' ? `${p.lensType} · UV400` : p.lensCompatible ? 'Aceita lentes de grau' : p.lensType], ['Gênero', p.gender[0].toUpperCase() + p.gender.slice(1)], ['Código', p.sku]].map(([k, v]) => (
                    <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
                  ))}
                </dl>
              </Accordion>
              <Accordion title="Garantia"><p>Garantia legal contra defeitos de fabricação. O prazo e as condições da garantia estendida, se houver, são definidos no painel administrativo.</p></Accordion>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <section className="mt-20" aria-labelledby="aval">
          <h2 id="aval" className="text-h3">Avaliações</h2>
          <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-10 text-center">
            <div className="flex gap-1 text-line">{Array.from({ length: 5 }).map((_, k) => <Star key={k} size={20} className="fill-current" />)}</div>
            <p className="mt-3 font-semibold">Este produto ainda não tem avaliações.</p>
            <p className="mt-1 text-sm text-muted">Clientes que compraram podem avaliar após a entrega.</p>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-h3">Você também pode gostar</h2>
            <Scroller items={related} />
          </section>
        )}
      </div>

      {/* CTA fixo no mobile */}
      {!soldOut && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-surface/95 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted">{p.name} · {p.colors[color].name}</p>
            <p className="font-bold">{brl(price)}</p>
          </div>
          {p.lensCompatible ? <Link href={lensHref} className="btn btn-primary !px-5">Escolher lentes</Link> : <button onClick={() => add({ slug: p.slug, color })} className="btn btn-primary !px-5">Adicionar</button>}
        </div>
      )}

      {/* Zoom */}
      {zoom && (
        <div role="dialog" aria-modal="true" aria-label="Imagem ampliada" className="fixed inset-0 z-[90] flex flex-col bg-background animate-[fadeIn_.3s_ease]">
          <div className="flex h-16 items-center justify-between px-5">
            <p className="font-heading text-[20px]">{p.name}</p>
            <button onClick={() => setZoom(false)} aria-label="Fechar" className="grid h-11 w-11 place-items-center"><X /></button>
          </div>
          <div className="flex-1 overflow-auto">
            {current.render('mx-auto aspect-square w-[180%] max-w-none md:w-full md:max-w-4xl')}
          </div>
          <div className="flex justify-center gap-3 p-4">
            {gallery.length > 1 && gallery.map((g, k) => (
              <button key={g.id} onClick={() => setView(k)} className={`chip ${view === k ? '!bg-secondary !text-white' : ''}`}>{view === k && <Check size={14} />}{g.label}</button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
