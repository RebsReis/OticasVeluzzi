import Link from 'next/link';
import { ShieldCheck, CreditCard, Headset, Truck, BadgeCheck, ArrowRight, Star, Glasses, Eye, Sparkles } from 'lucide-react';
import { Hero, Newsletter } from '@/components/HomeClient';
import { TabbedShelf, Scroller } from '@/components/Shelf';
import { EditorialScene } from '@/components/Editorial';
import FrameArt from '@/components/FrameArt';
import { WhatsappIcon } from '@/components/Social';
import { collections, getProduct, products } from '@/lib/data';

const benefits = [
  { icon: ShieldCheck, title: 'Compra segura', text: 'Ambiente protegido e dados criptografados' },
  { icon: CreditCard, title: 'Pagamento facilitado', text: 'Pix, cartão em até 10x ou boleto' },
  { icon: Headset, title: 'Atendimento especializado', text: 'Orientação para escolher armação e lentes' },
  { icon: Truck, title: 'Entrega', text: 'Envio para todo o Brasil ou retirada na loja' },
  { icon: BadgeCheck, title: 'Garantia', text: 'Produtos com garantia contra defeitos de fabricação' },
];

const categories = [
  { label: 'Óculos de grau', href: '/categoria/oculos-de-grau', product: 'classic-black' },
  { label: 'Óculos de sol', href: '/categoria/oculos-de-sol', product: 'urban-brown' },
  { label: 'Feminino', href: '/categoria/feminino', product: 'giulia' },
  { label: 'Masculino', href: '/categoria/masculino', product: 'enzo' },
  { label: 'Infantil', href: '/categoria/infantil', product: 'theo' },
  { label: 'Lentes', href: '/categoria/lentes', product: 'aurora' },
];

const by = (fn: (a: (typeof products)[number], b: (typeof products)[number]) => number) => [...products].sort(fn);

export default function Home() {
  const tabs = [
    { id: 'mais-vendidos', label: 'Mais vendidos', items: by((a, b) => b.sold - a.sold).slice(0, 8), href: '/categoria/todos?sort=vendidos' },
    { id: 'lancamentos', label: 'Lançamentos', items: products.filter((p) => p.isNew), href: '/categoria/lancamentos' },
    { id: 'ofertas', label: 'Ofertas especiais', items: products.filter((p) => p.salePrice), href: '/categoria/ofertas' },
    { id: 'feminino', label: 'Seleção feminina', items: products.filter((p) => p.gender === 'feminino'), href: '/categoria/feminino' },
    { id: 'masculino', label: 'Seleção masculina', items: products.filter((p) => p.gender === 'masculino'), href: '/categoria/masculino' },
  ];
  const recommended = by((a, b) => Number(b.lensCompatible) - Number(a.lensCompatible) || a.price - b.price).slice(0, 8);

  return (
    <>
      <Hero />

      {/* Benefícios */}
      <section aria-label="Benefícios" className="border-b border-line bg-surface">
        <ul className="container-v scroller scroll-px-[var(--container-padding)] gap-8 py-6 md:grid md:grid-cols-5 md:gap-6">
          {benefits.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex w-[240px] items-start gap-3 md:w-auto">
              <Icon size={24} strokeWidth={1.5} className="mt-0.5 flex-none text-accent" aria-hidden />
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="text-xs leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Categorias */}
      <section className="section container-v">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow" data-reveal>Encontre seu estilo</p>
          <h2 className="mt-3 text-h2" data-reveal>Escolha seu próximo olhar.</h2>
        </div>
        <ul className="grid grid-cols-2 gap-[var(--grid-gap)] md:grid-cols-3 lg:grid-cols-12">
          {categories.map((c, k) => {
            const p = getProduct(c.product)!;
            return (
              <li key={c.label} data-reveal className={k < 2 ? 'lg:col-span-6' : 'lg:col-span-3'}>
                <Link href={c.href} className="group relative block overflow-hidden rounded-xl">
                  <div className={`${k < 2 ? 'aspect-[4/5] lg:aspect-[16/10]' : 'aspect-[4/5]'} transition-transform duration-[400ms] ease-veluzzi group-hover:scale-[1.04]`}>
                    {k < 2 ? <EditorialScene product={p} tone={k === 0 ? 'sand' : 'stone'} className="h-full w-full" label={false} /> : <FrameArt product={p} className="h-full w-full" />}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent p-4 pt-20 text-white md:p-6">
                    <span className={`font-heading leading-tight ${k < 2 ? 'text-h4 md:text-h3' : 'text-[20px]'}`}>{c.label}</span>
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-primary text-ink transition-transform duration-300 group-hover:translate-x-1"><ArrowRight size={16} /></span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Vitrines */}
      <section className="section bg-surface">
        <div className="container-v">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow" data-reveal>Vitrine Veluzzi</p>
            <h2 className="mt-3 text-h2" data-reveal>Os favoritos da estação.</h2>
          </div>
          <TabbedShelf tabs={tabs} />
        </div>
      </section>

      {/* Editorial 1 — imagem à esquerda */}
      <section className="section container-v">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
          <EditorialScene product={getProduct('helena')!} tone="sand" className="aspect-[4/5] rounded-xl" />
          <div data-reveal className="max-w-md">
            <p className="eyebrow">Coleção Solar</p>
            <h2 className="mt-3 text-h2">Formas que acompanham a luz.</h2>
            <p className="mt-4 text-lg text-muted">Lentes com proteção UV400, metais finos e acetatos encorpados. Uma coleção pensada para quem trata os óculos de sol como parte do estilo.</p>
            <Link href="/categoria/oculos-de-sol" className="btn btn-primary mt-8">Conhecer a coleção</Link>
          </div>
        </div>
      </section>

      {/* Editorial 2 — imagem à direita, fluxo de lentes */}
      <section className="bg-secondary text-white">
        <div className="container-v grid items-center gap-10 py-[var(--section-spacing)] md:grid-cols-2 md:gap-20">
          <div data-reveal className="order-2 max-w-md md:order-1">
            <p className="eyebrow !text-primary">Óculos de grau sob medida</p>
            <h2 className="mt-3 text-h2">Monte seus óculos em cinco passos.</h2>
            <ol className="mt-8 space-y-4">
              {[[Glasses, 'Escolha a armação e a cor'], [Eye, 'Selecione o tipo de lente'], [Sparkles, 'Adicione tratamentos'], [BadgeCheck, 'Envie sua receita ou preencha os dados'], [ShieldCheck, 'Um profissional confere tudo antes da produção']].map(([Icon, t], k) => {
                const I = Icon as typeof Glasses;
                return (
                  <li key={k} className="flex items-center gap-4">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-white/20"><I size={18} className="text-primary" /></span>
                    <span className="text-white/85">{t as string}</span>
                  </li>
                );
              })}
            </ol>
            <Link href="/categoria/lentes" className="btn btn-primary mt-10">Montar meus óculos</Link>
          </div>
          <EditorialScene product={getProduct('verona')!} tone="stone" className="order-1 aspect-[4/5] rounded-xl md:order-2" />
        </div>
      </section>

      {/* Recomendados */}
      <section className="section container-v">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow" data-reveal>Recomendados</p>
            <h2 className="mt-3 text-h2" data-reveal>Selecionados para você.</h2>
          </div>
          <Link href="/categoria/todos" className="hidden text-sm font-bold hover:underline md:block">Ver catálogo completo</Link>
        </div>
        <Scroller items={recommended} />
      </section>

      {/* Coleções / marcas */}
      <section className="section border-y border-line bg-surface">
        <div className="container-v">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow" data-reveal>Marcas e coleções</p>
              <h2 className="mt-3 text-h2" data-reveal>Do clássico ao contemporâneo.</h2>
            </div>
            <span className="demo-tag">Coleções demonstrativas — cadastre as marcas reais no painel</span>
          </div>
          <ul className="grid grid-cols-2 gap-[var(--grid-gap)] md:grid-cols-5">
            {collections.map((c) => (
              <li key={c.slug} data-reveal>
                <Link href={`/categoria/todos?collection=${encodeURIComponent(c.name)}`} className="flex h-full flex-col justify-between rounded-md border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-md">
                  <span className="font-heading text-[22px] leading-tight">{c.name.replace('Coleção ', '')}</span>
                  <span className="mt-6 text-xs text-muted">{c.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Institucional */}
      <section id="sobre" className="section container-v">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-20">
          <div className="relative">
            <EditorialScene product={getProduct('dante')!} tone="olive" className="aspect-[4/5] rounded-xl" />
            <div className="absolute -bottom-6 right-6 max-w-[220px] rounded-md bg-primary p-5 text-ink shadow-lg md:-right-8">
              <p className="font-heading text-[22px] leading-tight">Cuidado em cada detalhe.</p>
            </div>
          </div>
          <div data-reveal>
            <p className="eyebrow">Sobre a Veluzzi</p>
            <h2 className="mt-3 text-h2">Uma ótica com alma de boutique.</h2>
            <p className="mt-5 text-lg text-muted">A Óticas Veluzzi une curadoria de armações, lentes de qualidade e atendimento próximo. Cada cliente é orientado na escolha do modelo, do tipo de lente e dos tratamentos ideais para a sua rotina.</p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {[['Curadoria', 'Armações escolhidas por estilo, conforto e acabamento.'], ['Precisão', 'Pedidos com receita passam por conferência técnica.'], ['Proximidade', 'Atendimento humano antes, durante e depois da compra.']].map(([t, d]) => (
                <li key={t} className="border-t border-accent pt-4">
                  <p className="font-heading text-[20px]">{t}</p>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted">Texto institucional provisório — revisar com a história real da empresa.</p>
          </div>
        </div>
      </section>

      {/* Avaliações — somente avaliações reais */}
      <section className="section bg-surface">
        <div className="container-v">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
            <div>
              <p className="eyebrow" data-reveal>Avaliações</p>
              <h2 className="mt-3 text-h2" data-reveal>Quem usa, recomenda.</h2>
            </div>
            <div data-reveal className="rounded-xl border border-dashed border-line bg-background p-8 text-center md:p-12">
              <div className="mb-4 flex justify-center gap-1 text-line">{Array.from({ length: 5 }).map((_, k) => <Star key={k} size={22} className="fill-current" />)}</div>
              <p className="font-heading text-[22px]">As avaliações dos clientes aparecerão aqui.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">Somente avaliações reais, enviadas após a entrega do pedido, são publicadas — com o selo de compra verificada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Atendimento */}
      <section id="atendimento" className="container-v py-[var(--section-spacing)]">
        <div className="relative overflow-hidden rounded-xl bg-primary px-6 py-12 text-ink md:px-16 md:py-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-ink/5" aria-hidden />
          <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div data-reveal>
              <h2 className="text-h2">Seu olhar merece cuidado.</h2>
              <p className="mt-3 max-w-lg text-lg text-ink/75">Dúvidas sobre medidas, lentes ou sua receita? Fale com um especialista Veluzzi pelo WhatsApp.</p>
            </div>
            <div data-reveal className="md:justify-self-end">
              <a href="#" className="btn bg-ink text-white hover:bg-secondary-dark" aria-describedby="wa-note"><WhatsappIcon /> Fale com um especialista</a>
              <p id="wa-note" className="mt-2 text-xs text-ink/60">Número do WhatsApp a configurar no painel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-secondary-dark text-white">
        <div className="container-v grid gap-8 py-16 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="eyebrow !text-primary">Newsletter</p>
            <h2 className="mt-3 text-h3">Novidades, lançamentos e ofertas em primeira mão.</h2>
          </div>
          <Newsletter />
        </div>
      </section>
    </>
  );
}
