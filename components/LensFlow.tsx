'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, Upload, FileText, Headset, Clock, PenLine, ShieldCheck, Lock } from 'lucide-react';
import ProductImage from './ProductImage';
import { brl, finalPrice, installments, lensTypes, treatments, type Product } from '@/lib/data';
import { lensPrice, useStore, type LensConfig } from '@/lib/store';

const steps = ['Armação', 'Tipo de lente', 'Tratamentos', 'Receita', 'Resumo'];
type Rx = { od: Record<string, string>; oe: Record<string, string>; dnp: string };
const rxFields = [
  { id: 'esf', label: 'Esférico' },
  { id: 'cil', label: 'Cilíndrico' },
  { id: 'eixo', label: 'Eixo' },
  { id: 'adicao', label: 'Adição' },
];

function Option({ selected, onClick, title, desc, price, multi = false }: { selected: boolean; onClick: () => void; title: string; desc: string; price: string; multi?: boolean }) {
  return (
    <button type="button" role={multi ? 'checkbox' : 'radio'} aria-checked={selected} onClick={onClick} className={`flex w-full items-start gap-4 rounded-md border bg-surface p-5 text-left transition-all duration-300 ${selected ? 'border-secondary shadow-md ring-1 ring-secondary' : 'border-line hover:border-muted'}`}>
      <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center border-2 ${multi ? 'rounded-xs' : 'rounded-full'} ${selected ? 'border-secondary bg-secondary text-white' : 'border-line'}`}>{selected && <Check size={14} strokeWidth={3} />}</span>
      <span className="flex-1">
        <span className="block font-bold">{title}</span>
        <span className="mt-1 block text-sm text-muted">{desc}</span>
      </span>
      <span className="whitespace-nowrap text-sm font-bold">{price}</span>
    </button>
  );
}

export default function LensFlow({ product: p }: { product: Product }) {
  const params = useSearchParams();
  const router = useRouter();
  const add = useStore((s) => s.add);
  const [step, setStep] = useState(0);
  const [color, setColor] = useState(Number(params.get('cor') ?? 0) || 0);
  const [typeId, setTypeId] = useState<string>('simples');
  const [tr, setTr] = useState<string[]>(['ar']);
  const [rxMode, setRxMode] = useState<LensConfig['prescription']>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState('');
  const [rx, setRx] = useState<Rx>({ od: {}, oe: {}, dnp: '' });
  const [rxErr, setRxErr] = useState('');

  const type = lensTypes.find((t) => t.id === typeId)!;
  const needsRx = type.needsPrescription;
  const frameOnly = typeId === 'frame-only';
  const lens: LensConfig | undefined = frameOnly ? undefined : { typeId, treatmentIds: tr, prescription: needsRx ? rxMode : 'none', prescriptionFile: needsRx && rxMode === 'upload' ? file?.name : undefined };
  const total = finalPrice(p) + lensPrice(lens);
  const inst = installments(total);

  // Etapas aplicáveis: sem lente pula tratamentos e receita; lente sem grau pula receita
  const applicable = useMemo(() => steps.map((_, k) => !(frameOnly && (k === 2 || k === 3)) && !(!needsRx && k === 3)), [frameOnly, needsRx]);
  const next = () => {
    if (step === 3 && !validateRx()) return;
    let n = step + 1;
    while (n < steps.length && !applicable[n]) n++;
    setStep(Math.min(n, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => {
    let n = step - 1;
    while (n > 0 && !applicable[n]) n--;
    setStep(Math.max(0, n));
  };

  function validateRx() {
    setRxErr('');
    if (rxMode === 'upload' && !file) { setRxErr('Envie a foto ou o PDF da receita, ou escolha outra opção.'); return false; }
    if (rxMode === 'manual') {
      const ok = rx.od.esf && rx.oe.esf;
      if (!ok) { setRxErr('Preencha ao menos o grau esférico dos dois olhos.'); return false; }
      if (typeId === 'multifocal' && (!rx.od.adicao || !rx.oe.adicao)) { setRxErr('Lentes multifocais exigem o valor de adição.'); return false; }
    }
    return true;
  }

  const onFile = (f: File | undefined) => {
    setFileErr('');
    if (!f) return;
    const okType = ['image/jpeg', 'image/png', 'image/heic', 'image/webp', 'application/pdf'].includes(f.type) || /\.(heic|pdf|jpe?g|png|webp)$/i.test(f.name);
    if (!okType) { setFileErr('Formato não aceito. Envie JPG, PNG, HEIC ou PDF.'); return; }
    if (f.size > 10 * 1024 * 1024) { setFileErr('O arquivo deve ter até 10 MB.'); return; }
    setFile(f);
  };

  const finish = () => {
    add({ slug: p.slug, color, lens });
    router.push('/carrinho');
  };

  const stepper = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = stepper.current?.querySelector<HTMLElement>('[aria-current="step"]');
    if (el && stepper.current) stepper.current.scrollTo({ left: el.offsetLeft - 20, behavior: 'smooth' });
  }, [step]);

  const visibleSteps = steps.map((s, k) => ({ s, k })).filter(({ k }) => applicable[k]);

  return (
    <div className="container-v pb-[calc(var(--section-spacing)+96px)] pt-8 lg:pb-[var(--section-spacing)]">
      <Link href={`/produto/${p.slug}`} className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold"><ChevronLeft size={16} /> Voltar ao produto</Link>
      <h1 className="mt-2 text-h2">Monte seus óculos</h1>

      {/* stepper */}
      <ol ref={stepper} className="scroller mt-8 gap-2 border-b border-line pb-4" aria-label="Etapas">
        {visibleSteps.map(({ s, k }, idx) => (
          <li key={s} className="flex items-center gap-2">
            <button onClick={() => k < step && setStep(k)} disabled={k > step} aria-current={k === step ? 'step' : undefined} className={`flex items-center gap-2 whitespace-nowrap text-sm font-semibold ${k === step ? 'text-ink' : k < step ? 'text-secondary' : 'text-muted'}`}>
              <span className={`grid h-7 w-7 place-items-center rounded-full text-xs ${k < step ? 'bg-secondary text-white' : k === step ? 'bg-primary text-ink' : 'border border-line'}`}>{k < step ? <Check size={14} /> : idx + 1}</span>
              {s}
            </button>
            {idx < visibleSteps.length - 1 && <span className="mx-2 h-px w-6 bg-line" />}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <div key={step} className="animate-[slideUp_.45s_cubic-bezier(.22,1,.36,1)]">
          {step === 0 && (
            <section>
              <h2 className="text-h4">Escolha a cor da armação</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {p.colors.map((c, k) => (
                  <button key={c.name} role="radio" aria-checked={color === k} onClick={() => setColor(k)} className={`overflow-hidden rounded-md border bg-surface text-left transition ${color === k ? 'border-secondary ring-1 ring-secondary' : 'border-line'}`}>
                    <ProductImage product={p} colorIndex={k} className="aspect-[4/3] w-full" />
                    <span className="flex items-center justify-between p-4 font-semibold">{c.name}{color === k && <Check size={18} className="text-secondary" />}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 1 && (
            <section>
              <h2 className="text-h4">Qual lente você precisa?</h2>
              <div className="mt-6 grid gap-3" role="radiogroup">
                {lensTypes.map((t) => (
                  <Option key={t.id} selected={typeId === t.id} onClick={() => setTypeId(t.id)} title={t.name} desc={t.desc} price={t.price ? `+ ${brl(t.price)}` : 'Incluso'} />
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">Outras opções de lente cadastradas pela ótica aparecerão aqui.</p>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="text-h4">Adicione tratamentos</h2>
              <p className="mt-2 text-muted">Selecione quantos quiser.</p>
              <div className="mt-6 grid gap-3">
                {treatments.map((t) => (
                  <Option key={t.id} multi selected={tr.includes(t.id)} onClick={() => setTr(tr.includes(t.id) ? tr.filter((x) => x !== t.id) : [...tr, t.id])} title={t.name} desc={t.desc} price={`+ ${brl(t.price)}`} />
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-h4">Sua receita oftalmológica</h2>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup">
                {[
                  { id: 'upload', icon: Upload, t: 'Enviar foto ou PDF', d: 'Fotografe a receita ou envie o arquivo.' },
                  { id: 'manual', icon: PenLine, t: 'Preencher os dados', d: 'Digite os valores da sua receita.' },
                  { id: 'specialist', icon: Headset, t: 'Falar com especialista', d: 'Receba orientação antes de concluir.' },
                  { id: 'later', icon: Clock, t: 'Enviar depois', d: 'Envie pela área do cliente após a compra.' },
                ].map((o) => (
                  <button key={o.id} role="radio" aria-checked={rxMode === o.id} onClick={() => { setRxMode(o.id as LensConfig['prescription']); setRxErr(''); }} className={`flex gap-3 rounded-md border bg-surface p-4 text-left transition ${rxMode === o.id ? 'border-secondary ring-1 ring-secondary' : 'border-line hover:border-muted'}`}>
                    <o.icon size={20} className="mt-0.5 flex-none text-accent" />
                    <span><span className="block font-bold">{o.t}</span><span className="text-sm text-muted">{o.d}</span></span>
                  </button>
                ))}
              </div>

              {rxMode === 'upload' && (
                <label className={`mt-6 flex cursor-pointer flex-col items-center rounded-md border-2 border-dashed p-8 text-center transition ${file ? 'border-success bg-[#38734C0D]' : 'border-line bg-surface hover:border-accent'}`}
                  onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}>
                  <input type="file" accept="image/*,.heic,application/pdf" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
                  {file ? (
                    <><FileText className="text-success" size={28} /><span className="mt-2 font-semibold">{file.name}</span><span className="text-sm text-muted">{(file.size / 1024).toFixed(0)} KB · toque para trocar</span></>
                  ) : (
                    <><Upload className="text-accent" size={28} /><span className="mt-2 font-semibold">Toque para escolher ou arraste o arquivo</span><span className="text-sm text-muted">JPG, PNG, HEIC ou PDF · até 10 MB</span></>
                  )}
                </label>
              )}
              {fileErr && <p className="mt-2 text-sm text-error" role="alert">{fileErr}</p>}

              {rxMode === 'manual' && (
                <div className="mt-6 overflow-x-auto rounded-md border border-line bg-surface p-4">
                  <table className="w-full min-w-[420px] text-sm">
                    <thead><tr><th className="p-2 text-left" /> {rxFields.filter((f) => f.id !== 'adicao' || typeId !== 'simples').map((f) => <th key={f.id} className="p-2 text-left font-semibold">{f.label}</th>)}</tr></thead>
                    <tbody>
                      {(['od', 'oe'] as const).map((eye) => (
                        <tr key={eye}>
                          <th className="p-2 text-left font-bold">{eye === 'od' ? 'OD (direito)' : 'OE (esquerdo)'}</th>
                          {rxFields.filter((f) => f.id !== 'adicao' || typeId !== 'simples').map((f) => (
                            <td key={f.id} className="p-1.5">
                              <input aria-label={`${f.label} ${eye.toUpperCase()}`} inputMode="decimal" value={rx[eye][f.id] ?? ''} onChange={(e) => setRx({ ...rx, [eye]: { ...rx[eye], [f.id]: e.target.value.replace(/[^\d.,+-]/g, '').slice(0, 6) } })} className="input !h-11 !px-2 text-center" placeholder={f.id === 'eixo' ? '0–180' : '0,00'} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <label className="mt-3 flex items-center gap-3 p-2 text-sm"><span className="font-bold">DNP (opcional)</span><input value={rx.dnp} onChange={(e) => setRx({ ...rx, dnp: e.target.value.replace(/[^\d.,/]/g, '') })} className="input !h-11 !w-28" placeholder="31/32" /></label>
                </div>
              )}
              {rxMode === 'specialist' && <p className="mt-6 rounded-md bg-surface p-5 text-sm">Após concluir o pedido, um especialista entra em contato para revisar sua receita antes da produção das lentes.</p>}
              {rxMode === 'later' && <p className="mt-6 rounded-md bg-surface p-5 text-sm">O pedido fica com o status <b>Aguardando receita</b> até o envio pela área do cliente. A produção começa após a conferência.</p>}
              {rxErr && <p className="mt-3 text-sm text-error" role="alert">{rxErr}</p>}

              <p className="mt-6 flex gap-2 text-xs leading-relaxed text-muted"><Lock size={14} className="mt-0.5 flex-none" /> Receitas são dados pessoais sensíveis: ficam em armazenamento protegido, com acesso restrito à equipe técnica, conforme a LGPD. Neste protótipo, nenhum arquivo é enviado.</p>
            </section>
          )}

          {step === 4 && (
            <section>
              <h2 className="text-h4">Confira seus óculos</h2>
              <div className="mt-6 overflow-hidden rounded-md border border-line bg-surface">
                <ProductImage product={p} colorIndex={color} className="aspect-[16/9] w-full" />
                <dl className="divide-y divide-line text-sm">
                  <div className="flex justify-between p-4"><dt>Armação {p.name} · {p.colors[color].name}</dt><dd className="font-semibold">{brl(finalPrice(p))}</dd></div>
                  <div className="flex justify-between p-4"><dt>Lente: {type.name}</dt><dd className="font-semibold">{type.price ? brl(type.price) : 'Incluso'}</dd></div>
                  {!frameOnly && tr.map((id) => { const t = treatments.find((x) => x.id === id)!; return <div key={id} className="flex justify-between p-4"><dt>{t.name}</dt><dd className="font-semibold">{brl(t.price)}</dd></div>; })}
                  {needsRx && <div className="flex justify-between p-4"><dt>Receita</dt><dd className="font-semibold">{{ upload: `Arquivo: ${file?.name}`, manual: 'Dados preenchidos', specialist: 'Orientação de especialista', later: 'Enviar depois', none: '' }[rxMode]}</dd></div>}
                </dl>
              </div>
              {needsRx && <p className="mt-4 flex gap-2 rounded-md bg-primary-light p-4 text-sm"><ShieldCheck size={18} className="flex-none" /> Um profissional responsável confere a receita antes de iniciar a produção das lentes.</p>}
            </section>
          )}

          <div className="mt-10 hidden gap-3 lg:flex">
            {step > 0 && <button onClick={prev} className="btn btn-outline">Voltar</button>}
            {step < 4 ? <button onClick={next} className="btn btn-primary">Continuar</button> : <button onClick={finish} className="btn btn-primary">Adicionar à sacola</button>}
          </div>
        </div>

        {/* Resumo em tempo real */}
        <aside className="hidden lg:block">
          <div className="sticky top-[calc(var(--header-height)+80px)] rounded-xl bg-surface p-[var(--card-padding)] shadow-md">
            <ProductImage product={p} colorIndex={color} className="aspect-[4/3] w-full rounded-sm" />
            <p className="eyebrow mt-5">{p.collection}</p>
            <p className="font-heading text-[24px]">{p.name}</p>
            <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <li className="flex justify-between"><span>Armação</span><span>{brl(finalPrice(p))}</span></li>
              <li className="flex justify-between"><span>{type.name}</span><span>{brl(type.price)}</span></li>
              {!frameOnly && tr.map((id) => { const t = treatments.find((x) => x.id === id)!; return <li key={id} className="flex justify-between"><span>{t.name}</span><span>{brl(t.price)}</span></li>; })}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-bold">Total</span>
              <span key={total} className="animate-[pop_.4s_cubic-bezier(.22,1,.36,1)] text-[26px] font-bold">{brl(total)}</span>
            </div>
            <p className="text-right text-sm text-muted">ou {inst.n}x de {brl(inst.value)}</p>
            <p className="mt-4 text-xs text-muted">Preços de lentes e tratamentos demonstrativos — configuráveis no painel.</p>
          </div>
        </aside>
      </div>

      {/* barra fixa mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mb-2 flex items-baseline justify-between text-sm"><span className="text-muted">Total atualizado</span><b key={total} className="animate-[pop_.4s_cubic-bezier(.22,1,.36,1)] text-lg">{brl(total)}</b></div>
        <div className="flex gap-3">
          {step > 0 && <button onClick={prev} className="btn btn-outline !px-4">Voltar</button>}
          {step < 4 ? <button onClick={next} className="btn btn-primary flex-1">Continuar</button> : <button onClick={finish} className="btn btn-primary flex-1">Adicionar à sacola</button>}
        </div>
      </div>
    </div>
  );
}
