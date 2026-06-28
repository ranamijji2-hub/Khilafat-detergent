'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingCart, MessageCircle, Check } from 'lucide-react';
import { useCart } from './CartContext';

export default function AddToCartBox({ product, whatsapp }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    router.push('/checkout');
  };

  const waMessage = `Hi! I'd like to order ${product.name} (${product.size}) x${qty}.`;
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^\d+]/g, '').replace(/^\+/, '')}?text=${encodeURIComponent(waMessage)}`
    : null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-ink/60">Quantity</span>
        <div className="flex items-center rounded-full border border-gray-200">
          <button
            aria-label="Decrease quantity"
            className="p-2.5 text-ink/60 hover:text-primary disabled:opacity-30"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            aria-label="Increase quantity"
            className="p-2.5 text-ink/60 hover:text-primary"
            onClick={() => setQty((q) => Math.min(50, q + 1))}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          disabled={!product.inStock}
          onClick={handleAdd}
          className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
        >
          {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          {added ? 'Added to Cart' : 'Add to Cart'}
        </button>
        <button
          disabled={!product.inStock}
          onClick={handleBuyNow}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
        </button>
      </div>

      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white"
        >
          <MessageCircle size={18} /> Order via WhatsApp
        </a>
      )}

      <p className="mt-4 text-center text-xs text-ink/45">Cash on Delivery available nationwide across Pakistan.</p>
    </div>
  );
}
