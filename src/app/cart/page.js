'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function CartPage() {
  const { items, hydrated, updateQty, removeItem, subtotal } = useCart();

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag size={56} className="text-primary/30" />
        <h1 className="mt-4 font-heading text-2xl font-extrabold text-ink">Your Cart is Empty</h1>
        <p className="mt-2 text-sm text-ink/55">Looks like you haven't added any Khilafat Detergent packs yet.</p>
        <Link href="/products" className="btn-primary mt-6 rounded-full px-7 py-3 text-sm font-bold">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-heading text-3xl font-extrabold text-ink">Your Cart</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
            <img src={item.image || '/images/products/khilafat-1kg.webp'} alt={item.name} className="h-20 w-20 shrink-0 object-contain" />
            <div className="flex-1">
              <h3 className="font-heading text-sm font-bold text-ink">{item.name}</h3>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">{item.size}</span>
              <div className="mt-2 text-sm font-bold text-primary">Rs. {item.price} each</div>
            </div>
            <div className="flex items-center rounded-full border border-gray-200">
              <button className="p-2 text-ink/60 hover:text-primary" onClick={() => updateQty(item.productId, item.qty - 1)} aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
              <button className="p-2 text-ink/60 hover:text-primary" onClick={() => updateQty(item.productId, item.qty + 1)} aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
            <div className="w-20 text-right font-heading text-sm font-extrabold text-ink">
              Rs. {(item.price * item.qty).toFixed(0)}
            </div>
            <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600" aria-label="Remove item">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4 rounded-2xl bg-primary/5 p-6">
        <div className="flex w-full max-w-xs justify-between text-sm text-ink/60">
          <span>Subtotal</span>
          <span className="font-bold text-ink">Rs. {subtotal.toFixed(0)}</span>
        </div>
        <div className="flex w-full max-w-xs justify-between text-sm text-ink/60">
          <span>Delivery</span>
          <span className="font-bold text-green-600">Calculated at delivery</span>
        </div>
        <div className="flex w-full max-w-xs justify-between border-t border-primary/15 pt-3 text-base">
          <span className="font-bold text-ink">Total</span>
          <span className="font-heading font-extrabold text-primary">Rs. {subtotal.toFixed(0)}</span>
        </div>
        <Link href="/checkout" className="btn-primary flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold shadow-soft">
          Proceed to Checkout <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
