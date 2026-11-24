'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/data';
import { useHydrated, useStore } from '@/lib/store';

export default function FavoritesPage() {
  const hydrated = useHydrated();
  const favs = useStore((s) => s.favorites);
  const list = products.filter((p) => favs.includes(p.slug));
  return (
    <div className="container-v pb-[calc(var(--section-spacing)+var(--bottom-nav))] pt-10">
      <h1 className="text-h2">Favoritos</h1>
      {!hydrated ? <div className="skeleton mt-8 h-60" /> : list.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-16 text-center">
          <Heart size={36} className="text-accent" />
          <p className="mt-4 font-heading text-[24px]">Nenhum favorito ainda</p>
          <p className="mt-2 text-sm text-muted">Toque no coração dos produtos para salvá-los aqui.</p>
          <Link href="/categoria/todos" className="btn btn-primary mt-6">Explorar coleções</Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-[var(--grid-gap)] gap-y-10 md:grid-cols-4">{list.map((p) => <li key={p.id}><ProductCard product={p} priority /></li>)}</ul>
      )}
    </div>
  );
}
