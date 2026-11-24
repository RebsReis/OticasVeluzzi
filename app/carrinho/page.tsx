'use client';
import Link from 'next/link';
import { ShoppingBag, Lock } from 'lucide-react';
import { CartLine, CouponBox, ShippingCalc } from '@/components/CartParts';
import { Scroller } from '@/components/Shelf';
import { brl, installments, products, storeSettings } from '@/lib/data';
import { cartTotals, useHydrated, useStore } from '@/lib/store';

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useStore((s) => s.items);
  const coupon = useStore((s) => s.coupon);
  const t = cartTotals(items, coupon);
  const inst = installments(t.total);
  const recs = products.filter((p) => !items.some((i) => i.slug === p.slug) && p.stock > 0).sort((a, b) => b.sold - a.sold).slice(0, 8);

  if (!hydrated) return <div className="container-v py-20"><div className="skeleton h-10 w-60" /><div className="skeleton mt-8 h-40" /></div>;

  return (
    <div className="container-v pb-[calc(var(--section-spacing)+var(--bottom-nav))] pt-10">
      <h1 className="text-h2">Sacola</h1>
      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-16 text-center">
          <ShoppingBag size={36} className="text-accent" />
          <p className="mt-4 font-heading text-[24px]">Sua sacola está vazia</p>
          <p className="mt-2 text-sm text-muted">Os itens adicionados ficam salvos mesmo se você sair do site.</p>
          <Link href="/categoria/todos" className="btn btn-primary mt-6">Explorar coleções</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
          <div>
            <ul className="divide-y divide-line border-y border-line">{items.map((i) => <CartLine key={i.key} item={i} />)}</ul>
            <Link href="/categoria/todos" className="mt-6 inline-block text-sm font-semibold underline">Continuar comprando</Link>
          </div>
          <aside>
            <div className="space-y-6 rounded-xl bg-surface p-[var(--card-padding)] shadow-md lg:sticky lg:top-[calc(var(--header-height)+72px)]">
              <h2 className="text-h4">Resumo do pedido</h2>
              <CouponBox />
              <ShippingCalc subtotal={t.total} />
              <dl className="space-y-2 border-t border-line pt-4 text-[15px]">
                <div className="flex justify-between"><dt>Subtotal ({t.count} {t.count === 1 ? 'item' : 'itens'})</dt><dd>{brl(t.subtotal)}</dd></div>
                {t.discount > 0 && <div className="flex justify-between text-success"><dt>Desconto</dt><dd>−{brl(t.discount)}</dd></div>}
                <div className="flex justify-between"><dt>Frete</dt><dd className="text-muted">{t.total >= storeSettings.freeShippingFrom ? 'Grátis' : 'Calculado no checkout'}</dd></div>
                <div className="flex justify-between border-t border-line pt-3 text-xl font-bold"><dt>Total</dt><dd>{brl(t.total)}</dd></div>
                <p className="text-right text-sm text-muted">ou {inst.n}x de {brl(inst.value)} sem juros</p>
              </dl>
              <Link href="/checkout" className="btn btn-primary w-full"><Lock size={16} /> Finalizar compra</Link>
            </div>
          </aside>
        </div>
      )}
      {recs.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-h3">Complete seu visual</h2>
          <Scroller items={recs} />
        </section>
      )}
    </div>
  );
}
