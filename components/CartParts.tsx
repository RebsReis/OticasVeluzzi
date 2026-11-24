'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Minus, Plus, Trash2, X, ShoppingBag, Check } from 'lucide-react';
import FrameArt from './FrameArt';
import { brl, getProduct, lensTypes, storeSettings, treatments, products, finalPrice } from '@/lib/data';
import { cartTotals, itemUnitPrice, useHydrated, useStore, type CartItem, demoCoupons } from '@/lib/store';

export function LensSummary({ item }: { item: CartItem }) {
  if (!item.lens) return null;
  const t = lensTypes.find((x) => x.id === item.lens!.typeId);
  const tr = item.lens.treatmentIds.map((id) => treatments.find((x) => x.id === id)?.name).filter(Boolean);
  const rx = { upload: 'Receita enviada', manual: 'Receita preenchida', specialist: 'Orientação de especialista', later: 'Receita a enviar', none: '' }[item.lens.prescription];
  return (
    <p className="mt-1 text-xs leading-relaxed text-muted">
      Lente: {t?.name}
      {tr.length > 0 && <> · {tr.join(', ')}</>}
      {rx && <> · {rx}</>}
    </p>
  );
}

export function CartLine({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const setQty = useStore((s) => s.setQty);
  const remove = useStore((s) => s.remove);
  const p = getProduct(item.slug);
  if (!p) return null;
  const unit = itemUnitPrice(item);
  return (
    <li className="flex gap-4 py-5">
      <Link href={`/produto/${p.slug}`} className={`flex-none overflow-hidden rounded-sm ${compact ? 'h-24 w-20' : 'h-32 w-28'}`}>
        <FrameArt product={p} colorIndex={item.color} className="h-full w-full" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="eyebrow !text-[10px]">{p.collection}</p>
            <Link href={`/produto/${p.slug}`} className="font-heading text-[18px] leading-tight">{p.name}</Link>
            <p className="text-xs text-muted">Cor: {p.colors[item.color]?.name}</p>
            <LensSummary item={item} />
          </div>
          <button onClick={() => remove(item.key)} aria-label={`Remover ${p.name}`} className="-mr-2 -mt-2 grid h-11 w-11 flex-none place-items-center text-muted hover:text-error"><Trash2 size={17} /></button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex h-10 items-center rounded-full border border-line">
            <button onClick={() => setQty(item.key, item.qty - 1)} disabled={item.qty <= 1} aria-label="Diminuir quantidade" className="grid h-10 w-10 place-items-center disabled:opacity-30"><Minus size={15} /></button>
            <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{item.qty}</span>
            <button onClick={() => setQty(item.key, item.qty + 1)} disabled={item.qty >= Math.min(10, p.stock)} aria-label="Aumentar quantidade" className="grid h-10 w-10 place-items-center disabled:opacity-30"><Plus size={15} /></button>
          </div>
          <p className="font-bold">{brl(unit * item.qty)}</p>
        </div>
      </div>
    </li>
  );
}

export function CouponBox() {
  const coupon = useStore((s) => s.coupon);
  const setCoupon = useStore((s) => s.setCoupon);
  const [v, setV] = useState('');
  const [err, setErr] = useState('');
  if (coupon)
    return (
      <div className="flex items-center justify-between rounded-sm bg-primary-light px-4 py-3 text-sm">
        <span className="flex items-center gap-2 font-semibold"><Check size={16} /> Cupom {coupon} aplicado</span>
        <button onClick={() => setCoupon(null)} className="font-semibold underline">Remover</button>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const code = v.trim().toUpperCase();
        if (!code) return;
        if (demoCoupons[code] !== undefined) { setCoupon(code); setErr(''); setV(''); }
        else setErr('Cupom inválido ou expirado.');
      }}
    >
      <label htmlFor="cupom" className="mb-1.5 block text-sm font-semibold">Cupom de desconto</label>
      <div className="flex gap-2">
        <input id="cupom" value={v} onChange={(e) => setV(e.target.value)} className="input !h-11 uppercase" placeholder="Digite o código" aria-invalid={!!err} aria-describedby="cupom-msg" />
        <button className="btn btn-outline !min-h-[44px] !px-5">Aplicar</button>
      </div>
      <p id="cupom-msg" className={`mt-1.5 text-xs ${err ? 'text-error' : 'text-muted'}`}>{err || 'Demonstração: use BEMVINDO10.'}</p>
    </form>
  );
}

export function ShippingCalc({ subtotal }: { subtotal: number }) {
  const [cep, setCep] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const free = subtotal >= storeSettings.freeShippingFrom;
  const fmt = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (cep.replace(/\D/g, '').length !== 8) { setState('error'); return; }
          setState('loading');
          setTimeout(() => setState('done'), 700);
        }}
      >
        <label htmlFor="cep-calc" className="mb-1.5 block text-sm font-semibold">Calcular frete</label>
        <div className="flex gap-2">
          <input id="cep-calc" inputMode="numeric" value={cep} onChange={(e) => { setCep(fmt(e.target.value)); setState('idle'); }} className="input !h-11" placeholder="00000-000" aria-invalid={state === 'error'} />
          <button className="btn btn-outline !min-h-[44px] !px-5">{state === 'loading' ? '...' : 'Calcular'}</button>
        </div>
      </form>
      {state === 'error' && <p className="mt-1.5 text-xs text-error">Informe um CEP com 8 dígitos.</p>}
      {state === 'loading' && <div className="mt-3 space-y-2"><div className="skeleton h-10" /><div className="skeleton h-10" /></div>}
      {state === 'done' && (
        <ul className="mt-3 divide-y divide-line rounded-sm border border-line text-sm">
          <li className="flex justify-between px-3 py-2.5"><span>Econômico · 6 a 9 dias úteis</span><b>{free ? 'Grátis' : brl(24.9)}</b></li>
          <li className="flex justify-between px-3 py-2.5"><span>Expresso · 2 a 4 dias úteis</span><b>{brl(39.9)}</b></li>
          <li className="flex justify-between px-3 py-2.5"><span>Retirar na loja</span><b>Grátis</b></li>
          <li className="px-3 py-2 text-xs text-muted">Valores demonstrativos — integração com serviço de frete na Fase 2.</li>
        </ul>
      )}
    </div>
  );
}

export function CartDrawer() {
  const open = useStore((s) => s.drawerOpen);
  const setOpen = useStore((s) => s.openDrawer);
  const items = useStore((s) => s.items);
  const coupon = useStore((s) => s.coupon);
  const add = useStore((s) => s.add);
  const hydrated = useHydrated();
  const t = cartTotals(items, coupon);
  const missing = Math.max(0, storeSettings.freeShippingFrom - t.total);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  const suggestions = products.filter((p) => !items.some((i) => i.slug === p.slug) && p.stock > 0).sort((a, b) => b.sold - a.sold).slice(0, 2);

  return (
    <div className={`fixed inset-0 z-[70] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
      <aside role="dialog" aria-modal="true" aria-label="Sacola de compras" className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-background shadow-lg transition-transform duration-300 ease-veluzzi ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-[72px] items-center justify-between border-b border-line px-6">
          <h2 className="text-[24px]">Sua sacola {hydrated && t.count > 0 && <span className="font-body text-base text-muted">({t.count})</span>}</h2>
          <button onClick={() => setOpen(false)} aria-label="Fechar sacola" className="-mr-2 grid h-11 w-11 place-items-center"><X /></button>
        </div>

        {!hydrated || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-primary-light"><ShoppingBag className="text-accent" /></span>
            <p className="font-heading text-[22px]">Sua sacola está vazia</p>
            <p className="text-sm text-muted">Explore as coleções e encontre o modelo que combina com você.</p>
            <Link href="/categoria/todos" onClick={() => setOpen(false)} className="btn btn-primary mt-2">Explorar coleções</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <div className="mt-5 rounded-sm bg-surface p-4 text-sm">
                {missing > 0 ? <>Faltam <b>{brl(missing)}</b> para o frete grátis</> : <b className="text-success">Você ganhou frete grátis!</b>}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${Math.min(100, (t.total / storeSettings.freeShippingFrom) * 100)}%` }} /></div>
              </div>
              <ul className="divide-y divide-line">{items.map((i) => <CartLine key={i.key} item={i} compact />)}</ul>
              {suggestions.length > 0 && (
                <div className="border-t border-line py-5">
                  <p className="eyebrow mb-3">Combina com sua escolha</p>
                  <ul className="space-y-3">
                    {suggestions.map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <span className="h-14 w-14 flex-none overflow-hidden rounded-sm"><FrameArt product={p} className="h-full w-full" /></span>
                        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{p.name}</span><span className="text-sm text-muted">{brl(finalPrice(p))}</span></span>
                        <button onClick={() => add({ slug: p.slug, color: 0 })} className="btn btn-outline !min-h-[40px] !px-4 !text-xs">Adicionar</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-3 border-t border-line bg-surface p-6">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{brl(t.subtotal)}</span></div>
              {t.discount > 0 && <div className="flex justify-between text-sm text-success"><span>Desconto ({coupon})</span><span>−{brl(t.discount)}</span></div>}
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{brl(t.total)}</span></div>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">Finalizar compra</Link>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/carrinho" onClick={() => setOpen(false)} className="btn btn-outline !min-h-[44px] !px-3 text-center">Ver sacola</Link>
                <button onClick={() => setOpen(false)} className="btn !min-h-[44px] !px-3 underline">Continuar comprando</button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function Toast() {
  const toast = useStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div role="status" className="fixed bottom-[calc(var(--bottom-nav)+16px)] left-1/2 z-[80] -translate-x-1/2 animate-[slideUp_.3s_cubic-bezier(.22,1,.36,1)] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg">
      {toast.text}
    </div>
  );
}
