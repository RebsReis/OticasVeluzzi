'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Heart, ShoppingBag, User, Phone, MapPin } from 'lucide-react';
import { InstagramIcon, WhatsappIcon } from './Social';
import { storeSettings as st, waLink } from '@/lib/data';
import { cartTotals, useHydrated, useStore } from '@/lib/store';

const cols = [
  { title: 'Produtos', links: [['Óculos de grau', '/categoria/oculos-de-grau'], ['Óculos de sol', '/categoria/oculos-de-sol'], ['Feminino', '/categoria/feminino'], ['Masculino', '/categoria/masculino'], ['Infantil', '/categoria/infantil'], ['Lentes', '/categoria/lentes']] },
  { title: 'Institucional', links: [['Sobre a Veluzzi', '/#sobre'], ['Nossa loja', '/#loja'], ['Instagram', 'https://www.instagram.com/oticasveluzzi_vilamatilde']] },
  { title: 'Ajuda', links: [['Minha conta', '/conta'], ['Meus pedidos', '/conta'], ['Trocas e devoluções', '/politicas#trocas'], ['Política de privacidade', '/politicas#privacidade'], ['Termos de uso', '/politicas#termos']] },
];

const payments = ['Pix', 'Visa', 'Mastercard', 'Elo', 'Amex', 'Boleto'];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/checkout')) {
    return (
      <footer className="border-t border-line py-8 text-center text-xs text-muted">
        Ambiente de compra protegido · Óticas Veluzzi
      </footer>
    );
  }
  return (
    <footer className="bg-secondary pb-[var(--bottom-nav)] text-white/80">
      <div className="container-v grid gap-12 py-16 md:grid-cols-[1.3fr_repeat(3,1fr)] md:py-20">
        <div className="space-y-6">
          <Image src="/brand/logo-light.png" alt="Óticas Veluzzi" width={1070} height={324} className="h-12 w-auto" />
          <p className="max-w-xs text-sm leading-relaxed">Elegância em cada olhar. Armações, lentes e atendimento especializado para cuidar da sua visão com estilo.</p>
          <div className="flex gap-2">
            <a href={st.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${st.instagramHandle}`} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:border-primary hover:text-primary"><InstagramIcon /></a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:border-primary hover:text-primary"><WhatsappIcon /></a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{c.title}</p>
            <ul className="space-y-2.5 text-sm">
              {c.links.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>

      <div id="lojas" className="container-v grid gap-8 border-t border-white/10 py-10 text-sm md:grid-cols-3">
        <div className="flex gap-3"><MapPin size={18} className="mt-0.5 flex-none text-primary" /><div><p className="font-semibold text-white">Nossa loja</p><p>{st.store.street} · {st.store.district}<br />{st.store.city} / {st.store.uf}</p><a href={st.store.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-semibold text-primary hover:underline">Como chegar</a></div></div>
        <div className="flex gap-3"><Phone size={18} className="mt-0.5 flex-none text-primary" /><div><p className="font-semibold text-white">Atendimento</p><a href={waLink()} target="_blank" rel="noopener noreferrer" className="block hover:text-white">WhatsApp {st.phone}</a><a href={st.instagram} target="_blank" rel="noopener noreferrer" className="block hover:text-white">{st.instagramHandle}</a></div></div>
        <div>
          <p className="mb-2 font-semibold text-white">Formas de pagamento</p>
          <ul className="flex flex-wrap gap-1.5">{payments.map((p) => <li key={p} className="rounded-xs border border-white/20 px-2 py-1 text-xs">{p}</li>)}</ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-v flex flex-col gap-2 py-6 text-xs text-white/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Óticas Veluzzi · {st.store.district}, {st.store.city}/{st.store.uf}</p>
          <p>Elegância em cada olhar.</p>
        </div>
      </div>
    </footer>
  );
}

export function BottomNav() {
  const pathname = usePathname() ?? '/';
  const hydrated = useHydrated();
  const items = useStore((s) => s.items);
  const favs = useStore((s) => s.favorites.length);
  const openDrawer = useStore((s) => s.openDrawer);
  const count = cartTotals(items, null).count;
  // Não interfere no checkout nem na personalização de lentes (que têm CTA fixo próprio)
  if (pathname.startsWith('/checkout') || pathname.includes('/lentes') || pathname.startsWith('/produto/')) return null;

  const link = (href: string, label: string, Icon: typeof Home, badge = 0, active = pathname === href) => (
    <Link href={href} className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${active ? 'text-secondary' : 'text-muted'}`} aria-current={active ? 'page' : undefined}>
      <Icon size={21} strokeWidth={active ? 2.2 : 1.7} />
      {label}
      {hydrated && badge > 0 && <span className="absolute left-1/2 top-1.5 ml-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-ink">{badge}</span>}
    </Link>
  );

  return (
    <nav aria-label="Navegação inferior" className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {link('/', 'Início', Home)}
      {link('/categoria/todos', 'Categorias', LayoutGrid, 0, pathname.startsWith('/categoria'))}
      {link('/favoritos', 'Favoritos', Heart, favs)}
      <button onClick={() => openDrawer(true)} className="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-muted">
        <ShoppingBag size={21} strokeWidth={1.7} /> Sacola
        {hydrated && count > 0 && <span className="absolute left-1/2 top-1.5 ml-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-ink">{count}</span>}
      </button>
      {link('/conta', 'Conta', User)}
    </nav>
  );
}
