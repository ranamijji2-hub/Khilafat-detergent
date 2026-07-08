'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, X } from 'lucide-react';
import { useCart } from './CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const handleAddToCart = () => {
  addItem(product, 1);

  setAdded(true);

  setTimeout(() => {
    setAdded(false);
  }, 2000);
};

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[var(--color-secondary)]/5 p-4">
        <img
          src={product.image || '/images/products/khilafat-1kg.webp'}
          alt={`Khilafat Detergent Powder ${product.size} pack`}
          loading="lazy"
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-ink">
            Best Seller
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{product.size}</span>
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              product.inStock ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {product.inStock ? <Check size={14} /> : <X size={14} />}
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-heading text-xl font-extrabold text-primary">Rs. {product.price}</span>
          <button
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className="btn-primary flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
          >
           {added ? (
  <>
    <Check size={16} />
    Added ✓
  </>
) : (
  <>
    <ShoppingCart size={16} />
    Add To Cart
  </>
)}
          </button>
        </div>
      </div>
    </div>
  );
}
