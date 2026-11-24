'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/data';

export function Scroller({ items }: { items: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };
  return (
    <div className="relative">
      <div
        ref={ref}
        tabIndex={0}
        aria-label="Produtos — use as setas para navegar"
        onKeyDown={(e) => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); }}
        className="scroller -mx-[var(--container-padding)] scroll-px-[var(--container-padding)] gap-[var(--grid-gap)] px-[var(--container-padding)] pb-2 focus-visible:outline-none"
      >
        {items.map((p) => (
          <div key={p.id} className="w-[72%] sm:w-[44%] md:w-[31%] lg:w-[calc((100%-72px)/4)]">
            <ProductCard product={p} priority />
          </div>
        ))}
      </div>
      <div className="mt-6 hidden justify-end gap-2 md:flex">
        <button onClick={() => move(-1)} aria-label="Anteriores" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface hover:border-ink"><ChevronLeft size={18} /></button>
        <button onClick={() => move(1)} aria-label="Próximos" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface hover:border-ink"><ChevronRight size={18} /></button>
      </div>
    </div>
  );
}

export function TabbedShelf({ tabs }: { tabs: { id: string; label: string; items: Product[]; href: string }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === active)!;
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="scroller -mx-[var(--container-padding)] scroll-px-[var(--container-padding)] gap-2 px-[var(--container-padding)] md:mx-0 md:px-0" role="tablist" aria-label="Vitrines">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={active === t.id} data-active={active === t.id} onClick={() => setActive(t.id)} className="chip">
              {t.label}
            </button>
          ))}
        </div>
        <Link href={tab.href} className="text-sm font-bold underline-offset-4 hover:underline">Ver todos</Link>
      </div>
      <div role="tabpanel" key={tab.id} className="animate-[slideUp_.5s_cubic-bezier(.22,1,.36,1)]">
        <Scroller items={tab.items} />
      </div>
    </div>
  );
}
