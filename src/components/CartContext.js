'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'khilafat_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or unavailable — non-fatal
    }
  }, [items, hydrated]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.productId === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(50, next[idx].qty + qty) };
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          size: product.size,
          price: product.price,
          image: product.image,
          slug: product.slug,
          qty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    setItems((prev) =>
      prev.map((it) => (it.productId === productId ? { ...it, qty: Math.max(1, Math.min(50, qty)) } : it))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { subtotal, count } = useMemo(() => {
    return items.reduce(
      (acc, it) => ({
        subtotal: acc.subtotal + it.price * it.qty,
        count: acc.count + it.qty,
      }),
      { subtotal: 0, count: 0 }
    );
  }, [items]);

  const value = { items, hydrated, addItem, removeItem, updateQty, clearCart, subtotal, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
