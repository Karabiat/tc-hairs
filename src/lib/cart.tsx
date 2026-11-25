"use client";

import * as React from "react";
import type { Category } from "@/lib/products";

export interface CartLine {
  key: string;
  slug: string;
  name: string;
  image: string;
  category: Category;
  price: number;
  color: string;
  length: number;
  qty: number;
}

type NewLine = Omit<CartLine, "key" | "qty">;

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  add: (line: NewLine, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "tc-hairs-cart-v1";

const lineKey = (line: NewLine) => `${line.slug}__${line.color}__${line.length}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* storage may be unavailable */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = React.useCallback((line: NewLine, qty = 1) => {
    const key = lineKey(line);
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { ...line, key, qty }];
    });
    setIsOpen(true);
  }, []);

  const remove = React.useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const setQty = React.useCallback((key: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clear = React.useCallback(() => setLines([]), []);
  const openCart = React.useCallback(() => setIsOpen(true), []);
  const closeCart = React.useCallback(() => setIsOpen(false), []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);

  const value: CartContextValue = {
    lines,
    count,
    subtotal,
    isOpen,
    hydrated,
    add,
    remove,
    setQty,
    clear,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
