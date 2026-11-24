'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { EditorialScene } from './Editorial';
import { getProduct } from '@/lib/data';

/** Banners do hero — na Fase 2 vêm do painel (Marketing → Banners da homepage). */
const slides = [
  { eyebrow: 'Uma nova perspectiva', title: 'Elegância em cada olhar.', text: 'Encontre os óculos que traduzem sua personalidade e transforme sua maneira de enxergar o mundo.', primary: { label: 'Comprar agora', href: '/categoria/todos' }, secondary: { label: 'Explorar coleções', href: '/categoria/marcas' }, product: 'giulia', color: 0, tone: 'olive' as const, image: '/campaign/hero-tartaruga.webp', position: '50% 40%' },
  { eyebrow: 'Coleção Solar', title: 'A luz do dia, do seu jeito.', text: 'Proteção UV400 e desenho editorial para acompanhar cada passeio.', primary: { label: 'Ver óculos de sol', href: '/categoria/oculos-de-sol' }, secondary: { label: 'Lançamentos', href: '/categoria/lancamentos' }, product: 'riviera', color: 0, tone: 'olive' as const, image: '/campaign/hero-solar.webp', position: '50% 30%' },
  { eyebrow: 'Lentes sob medida', title: 'Seu grau, sua armação.', text: 'Escolha a armação, personalize lentes e tratamentos e envie sua receita online.', primary: { label: 'Montar meus óculos', href: '/categoria/lentes' }, secondary: { label: 'Falar com especialista', href: '#atendimento' }, product: 'lorenzo', color: 0, tone: 'olive' as const, image: undefined as string | undefined, position: '' },
];

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [paused]);
  const s = slides[i];
  const product = getProduct(s.product)!;

  return (
    <section aria-roledescription="carrossel" aria-label="Campanhas" className="relative bg-secondary-dark text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid min-h-[calc(100svh-var(--header-height)-36px-48px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] max-md:min-h-0">
        <div className="relative order-2 flex items-center md:order-1">
          <div className="w-full px-[var(--container-padding)] py-12 md:py-20 xl:pl-[max(var(--container-padding),calc((100vw-var(--container-max))/2))]">
            <div key={i} className="max-w-xl">
              <p style={{ animationDelay: '0ms' }} className="hero-in eyebrow !text-primary">{s.eyebrow}</p>
              <h1 style={{ animationDelay: '100ms' }} className="hero-in mt-5 text-display">{s.title}</h1>
              <p style={{ animationDelay: '200ms' }} className="hero-in mt-6 max-w-[34ch] text-lg text-white/80">{s.text}</p>
              <div style={{ animationDelay: '300ms' }} className="hero-in mt-10 flex flex-wrap gap-3">
                <Link href={s.primary.href} className="btn btn-primary">{s.primary.label}</Link>
                <Link href={s.secondary.href} className="btn btn-ghost-light">{s.secondary.label}</Link>
              </div>
            </div>
            <div className="mt-12 flex items-center gap-3" role="tablist" aria-label="Escolher campanha">
              {slides.map((sl, k) => (
                <button key={k} role="tab" aria-selected={i === k} aria-label={sl.eyebrow} onClick={() => setI(k)} className="group grid h-11 place-items-center">
                  <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === k ? 'w-12 bg-primary' : 'w-6 bg-white/30 group-hover:bg-white/60'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="relative order-1 aspect-[4/3.4] md:order-2 md:aspect-auto">
          {s.image ? (
            <img key={i} src={s.image} alt="" className="absolute inset-0 h-full w-full animate-[fadeIn_.9s_cubic-bezier(.22,1,.36,1)] object-cover" style={{ objectPosition: s.position }} fetchPriority={i === 0 ? 'high' : 'auto'} />
          ) : (
            <EditorialScene key={i} product={product} colorIndex={s.color} tone={s.tone} className="absolute inset-0 animate-[fadeIn_.9s_cubic-bezier(.22,1,.36,1)]" />
          )}
        </div>
      </div>
    </section>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'error' | 'sending' | 'done'>('idle');
  const [msg, setMsg] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setState('error'); setMsg('Informe um e-mail válido.'); return; }
    if (!consent) { setState('error'); setMsg('Para continuar, autorize o recebimento das comunicações.'); return; }
    setState('sending');
    // Fase 2: POST /api/newsletter (registra consentimento, data/hora e origem — LGPD)
    setTimeout(() => setState('done'), 700);
  };
  if (state === 'done')
    return (
      <div className="flex items-center gap-3 rounded-md bg-white/10 p-6" role="status">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-primary text-ink"><Check size={20} /></span>
        <p>Cadastro confirmado. Você receberá nossas novidades em <b>{email}</b>. (Demonstração: nenhum dado foi enviado.)</p>
      </div>
    );
  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="news-email" className="sr-only">Seu e-mail</label>
        <input id="news-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu melhor e-mail" className="input !border-white/20 !bg-white/10 text-white placeholder:text-white/50" aria-invalid={state === 'error' && !email} />
        <button className="btn btn-primary" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : 'Quero receber'}</button>
      </div>
      <label className="mt-4 flex items-start gap-3 text-sm text-white/75">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 flex-none accent-[#D4AA3C]" />
        <span>Autorizo a Óticas Veluzzi a enviar novidades, lançamentos e ofertas por e-mail. Posso cancelar a qualquer momento. Saiba mais na <Link href="/politicas#privacidade" className="underline">Política de Privacidade</Link>.</span>
      </label>
      {state === 'error' && <p className="mt-2 text-sm text-[#F2B8B8]" role="alert">{msg}</p>}
    </form>
  );
}
