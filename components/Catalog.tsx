'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, X, ChevronDown, SearchX } from 'lucide-react';
import ProductCard from './ProductCard';
import { collections, finalPrice, pageCategories, products, type Product } from '@/lib/data';

type Filters = Record<string, string[]>;

const priceRanges = [
  { id: 'ate-400', label: 'Até R$ 400', test: (v: number) => v <= 400 },
  { id: '400-600', label: 'R$ 400 a R$ 600', test: (v: number) => v > 400 && v <= 600 },
  { id: 'acima-600', label: 'Acima de R$ 600', test: (v: number) => v > 600 },
];
const colorFamily = (p: Product) => p.colors.map((c) => c.name.split(' /')[0].split(' ')[0]);
const genderLabel: Record<string, string> = { feminino: 'Feminino', masculino: 'Masculino', unissex: 'Unissex' };

const groups: { key: string; label: string; options: (list: Product[]) => { value: string; label: string }[]; match: (p: Product, v: string) => boolean }[] = [
  { key: 'collection', label: 'Marca / coleção', options: () => collections.map((c) => ({ value: c.name, label: c.name })), match: (p, v) => p.collection === v },
  { key: 'price', label: 'Faixa de preço', options: () => priceRanges.map((r) => ({ value: r.id, label: r.label })), match: (p, v) => !!priceRanges.find((r) => r.id === v)?.test(finalPrice(p)) },
  { key: 'gender', label: 'Gênero', options: () => Object.entries(genderLabel).map(([value, label]) => ({ value, label })), match: (p, v) => p.gender === v },
  { key: 'color', label: 'Cor', options: (l) => [...new Set(l.flatMap(colorFamily))].sort().map((c) => ({ value: c, label: c })), match: (p, v) => colorFamily(p).includes(v) },
  { key: 'material', label: 'Material da armação', options: () => ['Acetato', 'Metal', 'Titânio', 'TR90'].map((m) => ({ value: m, label: m })), match: (p, v) => p.material === v },
  { key: 'shape', label: 'Formato da armação', options: () => ['redondo', 'quadrado', 'gatinho', 'aviador', 'retangular', 'hexagonal'].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) })), match: (p, v) => p.shape === v },
  { key: 'lens', label: 'Tipo de lente', options: () => [{ value: 'grau', label: 'Aceita lente de grau' }, { value: 'Polarizada', label: 'Polarizada' }, { value: 'Degradê', label: 'Degradê' }, { value: 'Espelhada', label: 'Espelhada' }], match: (p, v) => (v === 'grau' ? p.lensCompatible : p.lensType === v) },
  { key: 'size', label: 'Tamanho', options: () => [{ value: 'P', label: 'P (lente até 48 mm)' }, { value: 'M', label: 'M (49 a 54 mm)' }, { value: 'G', label: 'G (55 mm ou mais)' }], match: (p, v) => p.size === v },
  { key: 'stock', label: 'Disponibilidade', options: () => [{ value: 'disponivel', label: 'Em estoque' }], match: (p) => p.stock > 0 },
  { key: 'promo', label: 'Promoções', options: () => [{ value: 'sim', label: 'Somente produtos em oferta' }], match: (p) => !!p.salePrice },
];

const sorts = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'menor', label: 'Menor preço' },
  { id: 'maior', label: 'Maior preço' },
  { id: 'lancamentos', label: 'Lançamentos' },
  { id: 'vendidos', label: 'Mais vendidos' },
];
const PAGE = 8;

function FilterPanel({ base, filters, toggle }: { base: Product[]; filters: Filters; toggle: (k: string, v: string) => void }) {
  const [closed, setClosed] = useState<string[]>(['size', 'stock', 'promo']);
  return (
    <div className="divide-y divide-line">
      {groups.map((g) => {
        const opts = g.options(base);
        const open = !closed.includes(g.key);
        return (
          <fieldset key={g.key} className="py-4">
            <legend className="w-full">
              <button type="button" onClick={() => setClosed(open ? [...closed, g.key] : closed.filter((c) => c !== g.key))} aria-expanded={open} className="flex min-h-[44px] w-full items-center justify-between text-left text-sm font-bold">
                {g.label}
                {filters[g.key]?.length ? <span className="ml-2 mr-auto rounded-full bg-primary px-2 text-xs">{filters[g.key].length}</span> : null}
                <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
            </legend>
            {open && (
              <ul className="mt-1 space-y-0.5">
                {opts.map((o) => {
                  const n = base.filter((p) => g.match(p, o.value)).length;
                  const checked = !!filters[g.key]?.includes(o.value);
                  return (
                    <li key={o.value}>
                      <label className={`flex min-h-[40px] cursor-pointer items-center gap-3 text-sm ${n === 0 && !checked ? 'opacity-40' : ''}`}>
                        <input type="checkbox" checked={checked} disabled={n === 0 && !checked} onChange={() => toggle(g.key, o.value)} className="h-[18px] w-[18px] flex-none accent-[#4E5146]" />
                        <span className="flex-1">{o.label}</span>
                        <span className="text-xs text-muted">{n}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}

export default function Catalog({ slug }: { slug: string }) {
  const params = useSearchParams();
  const cat = pageCategories[slug] ?? pageCategories.todos;
  const q = params.get('q')?.trim() ?? '';

  const initial = useMemo(() => {
    const f: Filters = {};
    const map: Record<string, string> = { collection: 'collection', gender: 'gender', shape: 'shape', material: 'material', lens: 'lens' };
    Object.keys(map).forEach((k) => { const v = params.get(k); if (v) f[map[k]] = [v]; });
    const c = params.get('cat');
    if (c) f.__cat = [c];
    return f;
  }, [params]);

  const [filters, setFilters] = useState<Filters>(initial);
  const [sort, setSort] = useState(params.get('sort') ?? 'relevancia');
  const [shown, setShown] = useState(PAGE);
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setFilters(initial); setShown(PAGE); }, [initial]);
  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : ''; }, [drawer]);

  const base = useMemo(() => {
    let l = products.filter(cat.filter);
    if (filters.__cat) l = l.filter((p) => p.category === filters.__cat[0]);
    if (q) {
      const t = q.toLowerCase();
      l = l.filter((p) => [p.name, p.collection, p.shape, p.material, p.lensType, p.category === 'sol' ? 'sol solar' : 'grau'].join(' ').toLowerCase().includes(t));
    }
    return l;
  }, [cat, filters.__cat, q]);

  const result = useMemo(() => {
    const l = base.filter((p) => groups.every((g) => !filters[g.key]?.length || filters[g.key].some((v) => g.match(p, v))));
    const s = [...l];
    if (sort === 'menor') s.sort((a, b) => finalPrice(a) - finalPrice(b));
    if (sort === 'maior') s.sort((a, b) => finalPrice(b) - finalPrice(a));
    if (sort === 'lancamentos') s.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === 'vendidos') s.sort((a, b) => b.sold - a.sold);
    if (sort === 'relevancia') s.sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0));
    return s;
  }, [base, filters, sort]);

  const pulse = () => { setLoading(true); setShown(PAGE); setTimeout(() => setLoading(false), 280); };
  const toggle = (k: string, v: string) => {
    setFilters((f) => {
      const cur = f[k] ?? [];
      return { ...f, [k]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
    pulse();
  };
  const active = groups.flatMap((g) => (filters[g.key] ?? []).map((v) => ({ key: g.key, value: v, label: g.options(base).find((o) => o.value === v)?.label ?? v })));
  const clear = () => { setFilters(filters.__cat ? { __cat: filters.__cat } : {}); pulse(); };

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-v py-10 md:py-14">
          <nav aria-label="Navegação estrutural" className="mb-4 text-xs text-muted">
            <ol className="flex flex-wrap gap-1.5">
              <li><Link href="/" className="hover:text-ink">Início</Link> /</li>
              <li aria-current="page" className="text-ink">{q ? `Busca: “${q}”` : cat.title}</li>
            </ol>
          </nav>
          <h1 className="text-h1">{q ? `Resultados para “${q}”` : cat.title}</h1>
          {!q && <p className="mt-3 max-w-[60ch] text-lg text-muted">{cat.intro}</p>}
        </div>
      </section>

      <div className="container-v grid grid-cols-1 gap-10 pb-[calc(var(--section-spacing)+var(--bottom-nav))] pt-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filtros">
          <div className="sticky top-[calc(var(--header-height)+64px)] max-h-[calc(100vh-var(--header-height)-88px)] overflow-y-auto pr-2">
            <div className="flex items-center justify-between pb-2">
              <p className="text-sm font-bold uppercase tracking-[0.12em]">Filtrar</p>
              {active.length > 0 && <button onClick={clear} className="text-sm font-semibold underline">Limpar</button>}
            </div>
            <FilterPanel base={base} filters={filters} toggle={toggle} />
          </div>
        </aside>

        <div>
          <div className="sticky top-header z-30 -mx-[var(--container-padding)] mb-6 flex items-center justify-between gap-3 border-b border-line bg-background/95 px-[var(--container-padding)] py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
            <p className="text-sm text-muted" aria-live="polite"><b className="text-ink">{result.length}</b> {result.length === 1 ? 'produto' : 'produtos'}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setDrawer(true)} className="chip lg:hidden"><SlidersHorizontal size={16} /> Filtros {active.length > 0 && `(${active.length})`}</button>
              <label className="sr-only" htmlFor="ordenar">Ordenar por</label>
              <select id="ordenar" value={sort} onChange={(e) => { setSort(e.target.value); pulse(); }} className="h-10 rounded-full border border-line bg-surface px-4 text-sm font-medium">
                {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {active.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {active.map((a) => (
                <button key={a.key + a.value} onClick={() => toggle(a.key, a.value)} className="chip !min-h-[36px] !bg-primary-light !border-transparent">
                  {a.label} <X size={14} aria-label="remover" />
                </button>
              ))}
              <button onClick={clear} className="px-2 text-sm font-semibold underline">Limpar filtros</button>
            </div>
          )}

          {loading ? (
            <ul className="grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-10 md:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }).map((_, k) => (
                <li key={k}><div className="skeleton aspect-[4/5]" /><div className="skeleton mt-4 h-3 w-20" /><div className="skeleton mt-2 h-5 w-32" /><div className="skeleton mt-4 h-5 w-24" /></li>
              ))}
            </ul>
          ) : result.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-16 text-center">
              <SearchX size={36} className="text-accent" />
              <p className="mt-4 font-heading text-[24px]">{slug === 'acessorios' ? 'Nenhum acessório cadastrado ainda' : 'Nenhum produto encontrado'}</p>
              <p className="mt-2 max-w-sm text-sm text-muted">{slug === 'acessorios' ? 'Os acessórios aparecerão aqui assim que forem cadastrados no painel.' : 'Ajuste ou limpe os filtros para ver mais modelos.'}</p>
              <div className="mt-6 flex gap-3">
                {active.length > 0 && <button onClick={clear} className="btn btn-primary">Limpar filtros</button>}
                <Link href="/categoria/todos" className="btn btn-outline">Ver todos os óculos</Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-10 md:grid-cols-3">
                {result.slice(0, shown).map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
              </ul>
              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-sm text-muted">Exibindo {Math.min(shown, result.length)} de {result.length}</p>
                <div className="h-1 w-48 overflow-hidden rounded-full bg-line"><div className="h-full bg-secondary" style={{ width: `${(Math.min(shown, result.length) / result.length) * 100}%` }} /></div>
                {shown < result.length && <button onClick={() => setShown(shown + PAGE)} className="btn btn-outline mt-2">Carregar mais</button>}
              </div>
            </>
          )}
        </div>
      </div>

      {/* filtros mobile */}
      <div className={`fixed inset-0 z-[65] lg:hidden ${drawer ? '' : 'pointer-events-none'}`} aria-hidden={!drawer}>
        <div className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${drawer ? 'opacity-100' : 'opacity-0'}`} onClick={() => setDrawer(false)} />
        <div role="dialog" aria-modal="true" aria-label="Filtros" className={`absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col bg-surface transition-transform duration-300 ease-veluzzi ${drawer ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex h-[64px] items-center justify-between border-b border-line px-5">
            <p className="font-heading text-[22px]">Filtros</p>
            <button onClick={() => setDrawer(false)} aria-label="Fechar filtros" className="grid h-11 w-11 place-items-center"><X /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-5"><FilterPanel base={base} filters={filters} toggle={toggle} /></div>
          <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
            <button onClick={clear} className="btn btn-outline !px-3">Limpar</button>
            <button onClick={() => setDrawer(false)} className="btn btn-primary !px-3">Ver {result.length}</button>
          </div>
        </div>
      </div>
    </>
  );
}
