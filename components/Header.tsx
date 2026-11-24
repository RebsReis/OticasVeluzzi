'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X, ChevronRight, ChevronDown, MapPin, CreditCard, Truck, Headset, Lock } from 'lucide-react';
import { menu, products, storeSettings, brl, finalPrice, waLink, type MenuCategory } from '@/lib/data';
import { cartTotals, useHydrated, useStore } from '@/lib/store';
import ProductImage from './ProductImage';
import { WhatsappIcon } from './Social';

const topIcons = [Truck, CreditCard, CreditCard, MapPin];

function TopBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % storeSettings.topbar.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-secondary-dark text-[13px] text-white/90">
      <div className="container-v flex h-9 items-center justify-between gap-4">
        {/* mobile: mensagem rotativa */}
        <p className="flex-1 truncate text-center md:hidden" aria-live="polite">{storeSettings.topbar[i]}</p>
        {/* desktop: todas as condições */}
        <ul className="hidden items-center gap-6 md:flex">
          {storeSettings.topbar.map((t, k) => {
            const Icon = topIcons[k] ?? Truck;
            return (
              <li key={t} className="flex items-center gap-1.5 whitespace-nowrap">
                <Icon size={14} className="text-primary" aria-hidden /> {t}
              </li>
            );
          })}
        </ul>
        <Link href="/#loja" className="hidden items-center gap-1.5 whitespace-nowrap hover:text-primary lg:flex">
          <MapPin size={14} className="text-primary" aria-hidden /> Nossa loja
        </Link>
      </div>
    </div>
  );
}

function SearchBox({ onDone, autoFocus = false }: { onDone?: () => void; autoFocus?: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return products
      .filter((p) => [p.name, p.collection, p.shape, p.material, p.category === 'sol' ? 'sol solar' : 'grau'].join(' ').toLowerCase().includes(t))
      .slice(0, 5);
  }, [q]);

  const go = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;
    router.push(`/categoria/todos?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
    onDone?.();
  };

  return (
    <form onSubmit={go} role="search" className="relative w-full" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <label htmlFor="busca" className="sr-only">Buscar produtos</label>
      <input
        id="busca"
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Busque por modelo, formato ou coleção"
        className="h-12 w-full rounded-full border border-white/15 bg-white/10 pl-5 pr-12 text-[15px] text-white placeholder:text-white/60 focus:border-primary focus:bg-white/15 focus:outline-none"
        autoComplete="off"
      />
      <button type="submit" aria-label="Buscar" className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-full text-white hover:text-primary">
        <Search size={18} />
      </button>
      {open && q.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-md bg-surface text-ink shadow-lg">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-muted">Nenhum modelo encontrado para “{q}”. Tente “redondo”, “titânio” ou “solar”.</p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link href={`/produto/${p.slug}`} onClick={() => { setOpen(false); onDone?.(); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-background">
                    <span className="h-12 w-12 flex-none overflow-hidden rounded-sm"><ProductImage product={p} className="h-full w-full" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{p.name}</span>
                      <span className="block truncate text-xs text-muted">{p.collection}</span>
                    </span>
                    <span className="text-sm font-semibold">{brl(finalPrice(p))}</span>
                  </Link>
                </li>
              ))}
              <li><button type="submit" className="w-full border-t border-line px-4 py-3 text-left text-sm font-semibold hover:bg-background">Ver todos os resultados para “{q}”</button></li>
            </ul>
          )}
        </div>
      )}
    </form>
  );
}

function MegaPanel({ cat, onClose }: { cat: MenuCategory; onClose: () => void }) {
  const featured = products.filter((p) => (cat.slug === 'oculos-de-sol' ? p.category === 'sol' : cat.slug === 'feminino' ? p.gender === 'feminino' : cat.slug === 'masculino' ? p.gender === 'masculino' : cat.slug === 'infantil' ? p.kids : p.category === 'grau'))[0] ?? products[0];
  return (
    <div className="absolute inset-x-0 top-full z-40 border-t border-line bg-surface text-ink shadow-lg">
      <div className="container-v grid grid-cols-[1fr_320px] gap-12 py-10">
        <div className="grid grid-cols-3 gap-8">
          {cat.groups.map((g) => (
            <div key={g.title}>
              <p className="eyebrow mb-4">{g.title}</p>
              <ul className="space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.label}><Link href={l.href} onClick={onClose} className="text-[15px] hover:text-accent">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-3 border-t border-line pt-5">
            <Link href={`/categoria/${cat.slug}`} onClick={onClose} className="inline-flex items-center gap-1 text-sm font-bold hover:text-accent">Ver tudo em {cat.label} <ChevronRight size={16} /></Link>
          </div>
        </div>
        <Link href={cat.promo?.href ?? `/categoria/${cat.slug}`} onClick={onClose} className="group relative block overflow-hidden rounded-md">
          <ProductImage product={featured} className="aspect-[4/3] w-full transition-transform duration-[400ms] ease-veluzzi group-hover:scale-[1.04]" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 pt-12 font-heading text-[20px] leading-tight text-white">{cat.promo?.title ?? cat.label}</span>
        </Link>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className={`fixed inset-0 z-[60] md:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <nav aria-label="Menu principal" className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-surface transition-transform duration-300 ease-veluzzi ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[72px] items-center justify-between bg-secondary px-5">
          <Image src="/brand/logo-light.png" alt="Óticas Veluzzi" width={132} height={40} className="h-9 w-auto" />
          <button onClick={onClose} aria-label="Fechar menu" className="grid h-11 w-11 place-items-center text-white"><X /></button>
        </div>
        <ul className="flex-1 overflow-y-auto px-2 py-3">
          {menu.map((m) => (
            <li key={m.slug} className="border-b border-line">
              <button className="flex min-h-[52px] w-full items-center justify-between px-3 text-left text-[16px] font-semibold" aria-expanded={expanded === m.slug} onClick={() => setExpanded(expanded === m.slug ? null : m.slug)}>
                {m.label}
                <ChevronDown size={18} className={`transition-transform ${expanded === m.slug ? 'rotate-180' : ''}`} />
              </button>
              {expanded === m.slug && (
                <div className="pb-3 pl-3">
                  {m.groups.map((g) => (
                    <div key={g.title} className="py-1">
                      <p className="eyebrow px-3 py-2 !text-[11px]">{g.title}</p>
                      {g.links.map((l) => (
                        <Link key={l.label} href={l.href} onClick={onClose} className="block px-3 py-2.5 text-[15px] text-ink/80">{l.label}</Link>
                      ))}
                    </div>
                  ))}
                  <Link href={`/categoria/${m.slug}`} onClick={onClose} className="block px-3 py-2.5 text-[15px] font-bold">Ver tudo</Link>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-line p-5">
          <Link href="/conta" onClick={onClose} className="flex items-center gap-2 py-2 font-semibold"><User size={18} /> Entrar ou cadastrar</Link>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 font-semibold"><WhatsappIcon size={18} /> {storeSettings.phone}</a>
        </div>
      </nav>
    </div>
  );
}

export default function Header() {
  const [mega, setMega] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useHydrated();
  const items = useStore((s) => s.items);
  const favCount = useStore((s) => s.favorites.length);
  const openDrawer = useStore((s) => s.openDrawer);
  const count = cartTotals(items, null).count;
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMega(null); setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = menuOpen ? 'hidden' : ''; }, [menuOpen]);

  const activeCat = menu.find((m) => m.slug === mega);
  const inCheckout = pathname?.startsWith('/checkout');

  return (
    <>
      {!inCheckout && <TopBar />}
      <header className={`sticky top-0 z-50 bg-secondary text-white transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`} onMouseLeave={() => { clearTimeout(timer.current); setMega(null); }}>
        <div className="container-v flex h-header items-center gap-3 md:gap-8">
          <button className="-ml-2 grid h-11 w-11 place-items-center md:hidden" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}><Menu /></button>

          <Link href="/" className="flex-none max-md:mx-auto" aria-label="Óticas Veluzzi — página inicial">
            <Image src="/brand/logo-light.png" alt="Óticas Veluzzi" width={1070} height={324} priority className="h-9 w-auto md:h-12" />
          </Link>

          {!inCheckout && <div className="hidden max-w-xl flex-1 md:block"><SearchBox /></div>}

          <nav aria-label="Ações" className="flex items-center gap-1 md:ml-auto">
            {!inCheckout && (
              <>
                <button className="grid h-11 w-11 place-items-center md:hidden" aria-label="Buscar" onClick={() => setSearchOpen((v) => !v)}><Search size={22} /></button>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hidden h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:text-primary lg:flex"><WhatsappIcon size={20} /> Atendimento</a>
                <Link href="/conta" className="hidden h-11 w-11 place-items-center hover:text-primary md:grid" aria-label="Minha conta"><User size={22} /></Link>
                <Link href="/favoritos" className="relative hidden h-11 w-11 place-items-center hover:text-primary md:grid" aria-label={`Favoritos (${hydrated ? favCount : 0})`}>
                  <Heart size={22} />
                  {hydrated && favCount > 0 && <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-ink">{favCount}</span>}
                </Link>
                <button onClick={() => openDrawer(true)} className="relative -mr-2 grid h-11 w-11 place-items-center hover:text-primary" aria-label={`Sacola (${hydrated ? count : 0} itens)`}>
                  <ShoppingBag size={22} />
                  {hydrated && count > 0 && <span key={count} className="absolute right-1 top-1 grid h-[18px] min-w-[18px] animate-[pop_.4s_cubic-bezier(.22,1,.36,1)] place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-ink">{count}</span>}
                </button>
              </>
            )}
            {inCheckout && <span className="flex items-center gap-2 text-sm text-white/80"><Lock size={16} className="text-primary" /> Compra segura</span>}
          </nav>
        </div>

        {searchOpen && !inCheckout && <div className="container-v pb-4 md:hidden"><SearchBox autoFocus onDone={() => setSearchOpen(false)} /></div>}

        {!inCheckout && (
          <nav aria-label="Categorias" className="hidden border-t border-white/10 md:block">
            <ul className="container-v flex items-center justify-between gap-2 overflow-x-auto">
              {menu.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/categoria/${m.slug}`}
                    onMouseEnter={() => { clearTimeout(timer.current); timer.current = setTimeout(() => setMega(m.slug), 120); }}
                    onFocus={() => setMega(m.slug)}
                    className={`relative flex h-12 items-center whitespace-nowrap px-1 text-[14px] font-semibold transition-colors ${mega === m.slug ? 'text-primary' : 'text-white/90 hover:text-primary'} ${m.slug === 'ofertas' ? '!text-primary' : ''}`}
                    aria-expanded={mega === m.slug}
                  >
                    {m.label}
                    <span className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-300 ${mega === m.slug ? 'scale-x-100' : 'scale-x-0'}`} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {activeCat && <MegaPanel cat={activeCat} onClose={() => setMega(null)} />}
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
