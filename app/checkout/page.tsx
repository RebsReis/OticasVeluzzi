'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Lock, QrCode, CreditCard, FileText, Store, Truck, Pencil, PackageCheck } from 'lucide-react';
import FrameArt from '@/components/FrameArt';
import { LensSummary } from '@/components/CartParts';
import { brl, getProduct, installments, storeSettings } from '@/lib/data';
import { cartTotals, itemUnitPrice, useHydrated, useStore } from '@/lib/store';

/* ---------- validações ---------- */
const onlyDigits = (v: string) => v.replace(/\D/g, '');
function validCPF(v: string) {
  const c = onlyDigits(v);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const calc = (n: number) => { let s = 0; for (let i = 0; i < n; i++) s += Number(c[i]) * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
  return calc(9) === Number(c[9]) && calc(10) === Number(c[10]);
}
const mask = {
  cpf: (v: string) => onlyDigits(v).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2'),
  phone: (v: string) => onlyDigits(v).slice(0, 11).replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2'),
  cep: (v: string) => onlyDigits(v).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2'),
  card: (v: string) => onlyDigits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
  exp: (v: string) => onlyDigits(v).slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2'),
};

type Errors = Record<string, string>;

function Field({ id, label, error, ...rest }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} className="input" aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      {error && <small id={`${id}-err`} className="text-sm text-error">{error}</small>}
    </label>
  );
}

function StepCard({ n, title, active, done, onEdit, summary, children }: { n: number; title: string; active: boolean; done: boolean; onEdit: () => void; summary?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={`rounded-xl bg-surface p-[var(--card-padding)] ${active ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 font-heading text-h4">
          <span className={`grid h-8 w-8 place-items-center rounded-full font-body text-sm font-bold ${done ? 'bg-secondary text-white' : active ? 'bg-primary text-ink' : 'border border-line text-muted'}`}>{done ? <Check size={16} /> : n}</span>
          {title}
        </h2>
        {done && !active && <button onClick={onEdit} className="flex min-h-[44px] items-center gap-1 text-sm font-semibold underline"><Pencil size={14} /> Editar</button>}
      </div>
      {done && !active && summary && <div className="mt-3 pl-11 text-sm text-muted">{summary}</div>}
      {active && <div className="mt-6 animate-[slideUp_.4s_cubic-bezier(.22,1,.36,1)]">{children}</div>}
    </section>
  );
}

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const items = useStore((s) => s.items);
  const coupon = useStore((s) => s.coupon);
  const clear = useStore((s) => s.clear);
  const t = cartTotals(items, coupon);

  const [step, setStep] = useState(1);
  const [done, setDone] = useState<number[]>([]);
  const [id, setId] = useState({ name: '', cpf: '', email: '', phone: '', account: 'guest' as 'guest' | 'create', password: '' });
  const [addr, setAddr] = useState({ cep: '', street: '', number: '', comp: '', district: '', city: '', uf: '' });
  const [cepState, setCepState] = useState<'idle' | 'loading' | 'ok' | 'manual'>('idle');
  const [ship, setShip] = useState<'eco' | 'exp' | 'pickup'>('eco');
  const [pay, setPay] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '', inst: 1 });
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<null | { number: string; total: number; pay: string; email: string }>(null);

  const freeShip = t.total >= storeSettings.freeShippingFrom;
  const shipCost = ship === 'pickup' ? 0 : ship === 'eco' ? (freeShip ? 0 : 24.9) : 39.9;
  const pixOff = pay === 'pix' ? t.total * storeSettings.pixDiscount : 0;
  const grand = t.total + shipCost - pixOff;
  const inst = installments(grand);
  const hasRx = items.some((i) => i.lens && i.lens.prescription !== 'none');

  const finishStep = (n: number, errs: Errors) => {
    setErrors(errs);
    if (Object.keys(errs).length) {
      setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 50);
      return;
    }
    setDone((d) => [...new Set([...d, n])]);
    setStep(n + 1);
  };

  const submitId = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (id.name.trim().split(/\s+/).length < 2) er.name = 'Informe nome e sobrenome.';
    if (!validCPF(id.cpf)) er.cpf = 'CPF inválido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id.email)) er.email = 'E-mail inválido.';
    if (onlyDigits(id.phone).length < 10) er.phone = 'Telefone com DDD.';
    if (id.account === 'create' && id.password.length < 8) er.password = 'Mínimo de 8 caracteres.';
    finishStep(1, er);
  };

  const lookupCep = async (v: string) => {
    setAddr((a) => ({ ...a, cep: mask.cep(v) }));
    const d = onlyDigits(v);
    if (d.length !== 8) return;
    setCepState('loading');
    try {
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const j = await r.json();
      if (j.erro) throw new Error();
      setAddr((a) => ({ ...a, street: j.logradouro, district: j.bairro, city: j.localidade, uf: j.uf }));
      setCepState('ok');
      setTimeout(() => document.getElementById('numero')?.focus(), 50);
    } catch {
      setCepState('manual');
    }
  };

  const submitAddr = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (ship !== 'pickup') {
      if (onlyDigits(addr.cep).length !== 8) er.cep = 'CEP inválido.';
      if (!addr.street) er.street = 'Informe o endereço.';
      if (!addr.number) er.number = 'Informe o número.';
      if (!addr.city) er.city = 'Informe a cidade.';
      if (!/^[A-Za-z]{2}$/.test(addr.uf)) er.uf = 'UF';
    }
    finishStep(2, er);
  };

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (pay === 'card') {
      if (onlyDigits(card.number).length < 13) er.cardNumber = 'Número do cartão inválido.';
      if (card.name.trim().length < 3) er.cardName = 'Nome como está no cartão.';
      const [m, y] = card.exp.split('/').map(Number);
      if (!m || m > 12 || !y) er.exp = 'Validade inválida.';
      if (onlyDigits(card.cvv).length < 3) er.cvv = 'CVV inválido.';
    }
    setErrors(er);
    if (Object.keys(er).length) return;
    setPlacing(true);
    // Fase 2: POST /api/orders → servidor revalida preços, estoque e cupom e cria a cobrança no gateway (sandbox).
    // Os dados do cartão são tokenizados pelo SDK do gateway e nunca chegam ao nosso banco.
    setTimeout(() => {
      setOrder({ number: `DEMO-${Date.now().toString().slice(-6)}`, total: grand, pay, email: id.email });
      clear();
      setPlacing(false);
      window.scrollTo({ top: 0 });
    }, 1200);
  };

  if (!hydrated) return <div className="container-v py-20"><div className="skeleton h-10 w-60" /></div>;

  if (order)
    return (
      <div className="container-v max-w-2xl py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary animate-[pop_.5s_cubic-bezier(.22,1,.36,1)]"><PackageCheck size={30} /></span>
        <h1 className="mt-6 text-h2">Pedido recebido!</h1>
        <p className="mt-3 text-lg text-muted">Número do pedido <b className="text-ink">{order.number}</b></p>
        <div className="mx-auto mt-8 max-w-md space-y-3 rounded-xl bg-surface p-6 text-left text-sm shadow-sm">
          <div className="flex justify-between"><span>Total</span><b>{brl(order.total)}</b></div>
          <div className="flex justify-between"><span>Pagamento</span><b>{{ pix: 'Pix', card: 'Cartão de crédito', boleto: 'Boleto' }[order.pay]}</b></div>
          <div className="flex justify-between"><span>Status</span><b className="text-warning">Aguardando pagamento</b></div>
          {hasRx && <div className="flex justify-between"><span>Receita</span><b>Em análise pela equipe técnica</b></div>}
          <p className="border-t border-line pt-3 text-muted">A confirmação será enviada para <b className="text-ink">{order.email}</b>. Acompanhe a entrega na área do cliente.</p>
        </div>
        <p className="mx-auto mt-6 max-w-md rounded-sm bg-[#F6EBD3] p-3 text-xs text-warning">Simulação do protótipo: nenhum pagamento foi processado e nenhum e-mail foi enviado.</p>
        <Link href="/" className="btn btn-primary mt-8">Voltar para a loja</Link>
      </div>
    );

  if (items.length === 0)
    return (
      <div className="container-v py-20 text-center">
        <h1 className="text-h2">Sua sacola está vazia</h1>
        <Link href="/categoria/todos" className="btn btn-primary mt-8">Explorar coleções</Link>
      </div>
    );

  return (
    <div className="container-v pb-16 pt-8 md:pt-12">
      <h1 className="text-h2">Finalizar compra</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
        <div className="space-y-4">
          <StepCard n={1} title="Identificação" active={step === 1} done={done.includes(1)} onEdit={() => setStep(1)} summary={<>{id.name} · {id.email}</>}>
            <form onSubmit={submitId} noValidate className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field id="nome" label="Nome completo" autoComplete="name" value={id.name} onChange={(e) => setId({ ...id, name: e.target.value })} error={errors.name} /></div>
              <Field id="cpf" label="CPF" inputMode="numeric" value={id.cpf} onChange={(e) => setId({ ...id, cpf: mask.cpf(e.target.value) })} error={errors.cpf} placeholder="000.000.000-00" />
              <Field id="tel" label="Telefone" type="tel" autoComplete="tel" value={id.phone} onChange={(e) => setId({ ...id, phone: mask.phone(e.target.value) })} error={errors.phone} placeholder="(00) 00000-0000" />
              <div className="sm:col-span-2"><Field id="email" label="E-mail" type="email" autoComplete="email" value={id.email} onChange={(e) => setId({ ...id, email: e.target.value })} error={errors.email} /></div>
              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-sm font-semibold">Como deseja continuar?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[['guest', 'Comprar como visitante'], ['create', 'Criar conta e acompanhar pedidos']].map(([v, l]) => (
                    <label key={v} className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-sm border px-4 text-sm ${id.account === v ? 'border-secondary bg-background' : 'border-line'}`}>
                      <input type="radio" name="account" checked={id.account === v} onChange={() => setId({ ...id, account: v as 'guest' | 'create' })} className="accent-[#4E5146]" /> {l}
                    </label>
                  ))}
                </div>
              </fieldset>
              {id.account === 'create' && <div className="sm:col-span-2"><Field id="senha" label="Crie uma senha" type="password" autoComplete="new-password" value={id.password} onChange={(e) => setId({ ...id, password: e.target.value })} error={errors.password} /></div>}
              <button className="btn btn-primary sm:col-span-2">Continuar para entrega</button>
            </form>
          </StepCard>

          <StepCard n={2} title="Entrega" active={step === 2} done={done.includes(2)} onEdit={() => setStep(2)} summary={ship === 'pickup' ? 'Retirada na loja' : <>{addr.street}, {addr.number} · {addr.city}/{addr.uf}</>}>
            <form onSubmit={submitAddr} noValidate className="space-y-5">
              <div className="grid gap-2" role="radiogroup" aria-label="Opções de envio">
                {[
                  { v: 'eco', icon: Truck, l: 'Econômico', d: '6 a 9 dias úteis', price: freeShip ? 'Grátis' : brl(24.9) },
                  { v: 'exp', icon: Truck, l: 'Expresso', d: '2 a 4 dias úteis', price: brl(39.9) },
                  { v: 'pickup', icon: Store, l: 'Retirar na loja', d: 'Disponível quando a loja estiver cadastrada', price: 'Grátis' },
                ].map((o) => (
                  <label key={o.v} className={`flex min-h-[60px] cursor-pointer items-center gap-3 rounded-sm border px-4 ${ship === o.v ? 'border-secondary bg-background' : 'border-line'}`}>
                    <input type="radio" name="ship" checked={ship === o.v} onChange={() => setShip(o.v as typeof ship)} className="accent-[#4E5146]" />
                    <o.icon size={18} className="text-accent" />
                    <span className="flex-1"><b className="block text-sm">{o.l}</b><span className="text-xs text-muted">{o.d}</span></span>
                    <b className="text-sm">{o.price}</b>
                  </label>
                ))}
              </div>
              {ship !== 'pickup' && (
                <div className="grid gap-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <Field id="cep" label="CEP" inputMode="numeric" autoComplete="postal-code" value={addr.cep} onChange={(e) => lookupCep(e.target.value)} error={errors.cep} placeholder="00000-000" />
                    {cepState === 'loading' && <small className="text-xs text-muted">Buscando endereço…</small>}
                    {cepState === 'manual' && <small className="text-xs text-warning">Não encontramos o CEP automaticamente. Preencha o endereço.</small>}
                  </div>
                  <div className="sm:col-span-4"><Field id="rua" label="Endereço" autoComplete="address-line1" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} error={errors.street} /></div>
                  <div className="sm:col-span-2"><Field id="numero" label="Número" inputMode="numeric" value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} error={errors.number} /></div>
                  <div className="sm:col-span-4"><Field id="comp" label="Complemento (opcional)" value={addr.comp} onChange={(e) => setAddr({ ...addr, comp: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Field id="bairro" label="Bairro" value={addr.district} onChange={(e) => setAddr({ ...addr, district: e.target.value })} /></div>
                  <div className="sm:col-span-3"><Field id="cidade" label="Cidade" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} error={errors.city} /></div>
                  <div className="sm:col-span-1"><Field id="uf" label="UF" maxLength={2} value={addr.uf} onChange={(e) => setAddr({ ...addr, uf: e.target.value.toUpperCase() })} error={errors.uf} /></div>
                </div>
              )}
              <button className="btn btn-primary w-full">Continuar para pagamento</button>
            </form>
          </StepCard>

          <StepCard n={3} title="Pagamento" active={step === 3} done={false} onEdit={() => setStep(3)}>
            <form onSubmit={place} noValidate className="space-y-5">
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Forma de pagamento">
                {[{ v: 'pix', icon: QrCode, l: 'Pix' }, { v: 'card', icon: CreditCard, l: 'Cartão' }, { v: 'boleto', icon: FileText, l: 'Boleto' }].map((o) => (
                  <button type="button" key={o.v} role="radio" aria-checked={pay === o.v} onClick={() => { setPay(o.v as typeof pay); setErrors({}); }} className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-sm border text-sm font-semibold ${pay === o.v ? 'border-secondary bg-background ring-1 ring-secondary' : 'border-line'}`}>
                    <o.icon size={20} /> {o.l}
                  </button>
                ))}
              </div>
              {pay === 'pix' && <p className="rounded-sm bg-background p-4 text-sm">Pague com <b>{storeSettings.pixDiscount * 100}% de desconto</b>. O QR Code e o código copia-e-cola aparecem após a confirmação. A aprovação é imediata.</p>}
              {pay === 'boleto' && <p className="rounded-sm bg-background p-4 text-sm">O boleto vence em 3 dias úteis. O pedido é liberado após a compensação (até 2 dias úteis).</p>}
              {pay === 'card' && (
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-4"><Field id="cc" label="Número do cartão" inputMode="numeric" autoComplete="cc-number" value={card.number} onChange={(e) => setCard({ ...card, number: mask.card(e.target.value) })} error={errors.cardNumber} /></div>
                  <div className="sm:col-span-4"><Field id="ccname" label="Nome impresso no cartão" autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })} error={errors.cardName} /></div>
                  <div className="sm:col-span-2"><Field id="exp" label="Validade" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={card.exp} onChange={(e) => setCard({ ...card, exp: mask.exp(e.target.value) })} error={errors.exp} /></div>
                  <div className="sm:col-span-2"><Field id="cvv" label="CVV" inputMode="numeric" autoComplete="cc-csc" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: onlyDigits(e.target.value).slice(0, 4) })} error={errors.cvv} /></div>
                  <label className="field sm:col-span-4" htmlFor="parc">
                    <span>Parcelamento</span>
                    <select id="parc" className="input" value={card.inst} onChange={(e) => setCard({ ...card, inst: Number(e.target.value) })}>
                      {Array.from({ length: inst.n }).map((_, k) => <option key={k} value={k + 1}>{k + 1}x de {brl(grand / (k + 1))} sem juros</option>)}
                    </select>
                  </label>
                  <p className="flex gap-2 text-xs text-muted sm:col-span-4"><Lock size={14} className="flex-none" /> Os dados do cartão são criptografados e processados pelo gateway de pagamento. A Veluzzi não armazena o número do cartão.</p>
                </div>
              )}
              <button disabled={placing} className="btn btn-primary w-full">{placing ? 'Processando…' : `Confirmar pedido · ${brl(grand)}`}</button>
              <p className="text-center text-xs text-muted">Ao confirmar, você concorda com os <Link href="/politicas#termos" className="underline">Termos de uso</Link> e a <Link href="/politicas#privacidade" className="underline">Política de privacidade</Link>.</p>
            </form>
          </StepCard>
        </div>

        <aside>
          <div className="rounded-xl bg-surface p-[var(--card-padding)] shadow-sm lg:sticky lg:top-[calc(var(--header-height)+24px)]">
            <h2 className="text-h4">Resumo</h2>
            <ul className="mt-4 divide-y divide-line">
              {items.map((i) => {
                const p = getProduct(i.slug)!;
                return (
                  <li key={i.key} className="flex gap-3 py-3">
                    <span className="relative h-16 w-16 flex-none overflow-hidden rounded-sm"><FrameArt product={p} colorIndex={i.color} className="h-full w-full" /><span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[11px] font-bold text-white">{i.qty}</span></span>
                    <span className="min-w-0 flex-1 text-sm"><b className="block truncate">{p.name}</b><span className="text-xs text-muted">{p.colors[i.color].name}</span><LensSummary item={i} /></span>
                    <b className="text-sm">{brl(itemUnitPrice(i) * i.qty)}</b>
                  </li>
                );
              })}
            </ul>
            <dl className="space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{brl(t.subtotal)}</dd></div>
              {t.discount > 0 && <div className="flex justify-between text-success"><dt>Cupom {coupon}</dt><dd>−{brl(t.discount)}</dd></div>}
              <div className="flex justify-between"><dt>Frete</dt><dd>{step < 2 && !done.includes(2) ? '—' : shipCost ? brl(shipCost) : 'Grátis'}</dd></div>
              {pixOff > 0 && <div className="flex justify-between text-success"><dt>Desconto Pix</dt><dd>−{brl(pixOff)}</dd></div>}
              <div className="flex justify-between border-t border-line pt-3 text-lg font-bold"><dt>Total</dt><dd>{brl(grand)}</dd></div>
            </dl>
            <p className="mt-4 rounded-sm bg-[#F6EBD3] p-3 text-xs text-warning">Protótipo: valores de frete e pagamento simulados. Integração com gateway em ambiente sandbox na Fase 2.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
