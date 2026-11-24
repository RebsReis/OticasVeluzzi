'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { finalPrice, getProduct, lensTypes, treatments } from './data';

export type LensConfig = {
  typeId: string;
  treatmentIds: string[];
  prescription: 'upload' | 'manual' | 'specialist' | 'later' | 'none';
  prescriptionFile?: string;
};

export type CartItem = {
  key: string;
  slug: string;
  color: number;
  qty: number;
  lens?: LensConfig;
};

type Toast = { id: number; text: string };

type State = {
  items: CartItem[];
  favorites: string[];
  coupon: string | null;
  drawerOpen: boolean;
  toast: Toast | null;
  add: (item: Omit<CartItem, 'key' | 'qty'>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toggleFav: (slug: string) => void;
  setCoupon: (c: string | null) => void;
  openDrawer: (v: boolean) => void;
  notify: (text: string) => void;
};

const itemKey = (i: Omit<CartItem, 'key' | 'qty'>) => `${i.slug}:${i.color}:${i.lens ? JSON.stringify(i.lens) : ''}`;

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      favorites: [],
      coupon: null,
      drawerOpen: false,
      toast: null,
      add: (item, qty = 1) => {
        const key = itemKey(item);
        const items = [...get().items];
        const found = items.find((x) => x.key === key);
        if (found) found.qty = Math.min(found.qty + qty, 10);
        else items.push({ ...item, key, qty });
        set({ items, drawerOpen: true });
      },
      setQty: (key, qty) => set({ items: get().items.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(10, qty)) } : x)) }),
      remove: (key) => set({ items: get().items.filter((x) => x.key !== key) }),
      clear: () => set({ items: [], coupon: null }),
      toggleFav: (slug) => {
        const has = get().favorites.includes(slug);
        set({ favorites: has ? get().favorites.filter((s) => s !== slug) : [...get().favorites, slug] });
        get().notify(has ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
      },
      setCoupon: (coupon) => set({ coupon }),
      openDrawer: (drawerOpen) => set({ drawerOpen }),
      notify: (text) => {
        const id = Date.now();
        set({ toast: { id, text } });
        setTimeout(() => { if (get().toast?.id === id) set({ toast: null }); }, 2600);
      },
    }),
    {
      name: 'veluzzi-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, favorites: s.favorites, coupon: s.coupon }),
      // descarta itens salvos de produtos/cores que não existem mais no catálogo
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        const items = (p.items ?? []).filter((i) => { const prod = getProduct(i.slug); return !!prod && i.color < prod.colors.length; });
        return { ...current, ...p, items };
      },
    },
  ),
);

/** Evita divergência de hidratação: só exibe dados do localStorage após montar. */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

export function lensPrice(lens?: LensConfig) {
  if (!lens) return 0;
  const t = lensTypes.find((x) => x.id === lens.typeId)?.price ?? 0;
  const tr = lens.treatmentIds.reduce((s, id) => s + (treatments.find((x) => x.id === id)?.price ?? 0), 0);
  return t + tr;
}

export function itemUnitPrice(i: CartItem) {
  const prod = getProduct(i.slug);
  return (prod ? finalPrice(prod) : 0) + lensPrice(i.lens);
}

/** Cupons demonstrativos — na Fase 2 a validação acontece no servidor. */
export const demoCoupons: Record<string, number> = { BEMVINDO10: 0.1 };

export function cartTotals(items: CartItem[], coupon: string | null) {
  const subtotal = items.reduce((s, i) => s + itemUnitPrice(i) * i.qty, 0);
  const pct = coupon ? demoCoupons[coupon] ?? 0 : 0;
  const discount = Math.round(subtotal * pct * 100) / 100;
  return { subtotal, discount, total: subtotal - discount, count: items.reduce((s, i) => s + i.qty, 0) };
}
