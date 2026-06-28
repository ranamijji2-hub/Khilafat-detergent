'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function CheckoutPage() {
  const { items, subtotal, clearCart, hydrated } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-ink">Nothing to Checkout</h1>
        <p className="mt-2 text-sm text-ink/55">Your cart is empty. Add a few packs of Khilafat Detergent first.</p>
        <Link href="/products" className="btn-primary mt-6 inline-block rounded-full px-7 py-3 text-sm font-bold">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((it) => ({ productId: it.productId, qty: it.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { form: data.error || 'Something went wrong.' });
        setSubmitting(false);
        return;
      }
      clearCart();
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch {
      setErrors({ form: 'Network error — please try again.' });
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-heading text-3xl font-extrabold text-ink">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="font-heading text-lg font-bold text-ink">Delivery Details</h2>

          <Field label="Full Name" error={errors.customerName}>
            <input required value={form.customerName} onChange={update('customerName')} className="input" placeholder="e.g. Ayesha Khan" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone Number" error={errors.phone}>
              <input required value={form.phone} onChange={update('phone')} className="input" placeholder="03xx-xxxxxxx" />
            </Field>
            <Field label="Email (optional)" error={errors.email}>
              <input type="email" value={form.email} onChange={update('email')} className="input" placeholder="you@example.com" />
            </Field>
          </div>
          <Field label="Complete Address" error={errors.address}>
            <textarea required rows={3} value={form.address} onChange={update('address')} className="input" placeholder="House #, street, area, city" />
          </Field>
          <Field label="Order Notes (optional)" error={errors.notes}>
            <textarea rows={2} value={form.notes} onChange={update('notes')} className="input" placeholder="Any special delivery instructions?" />
          </Field>

          <div className="rounded-xl bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <Truck size={18} className="text-primary" /> Payment Method: Cash on Delivery
            </div>
            <p className="mt-1 text-xs text-ink/55">Pay in cash when your order is delivered. No online payment required.</p>
          </div>

          {errors.form && <p className="text-sm font-semibold text-red-500">{errors.form}</p>}
          {errors.items && <p className="text-sm font-semibold text-red-500">{errors.items}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold disabled:opacity-60"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? 'Placing Order…' : 'Place Order — Cash on Delivery'}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink/45">
            <ShieldCheck size={14} /> Your information is only used to process this order.
          </p>
        </form>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
          <h2 className="font-heading text-lg font-bold text-ink">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((it) => (
              <div key={it.productId} className="flex justify-between text-sm">
                <span className="text-ink/70">{it.name} ({it.size}) × {it.qty}</span>
                <span className="font-semibold text-ink">Rs. {(it.price * it.qty).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base">
            <span className="font-bold text-ink">Total</span>
            <span className="font-heading font-extrabold text-primary">Rs. {subtotal.toFixed(0)}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
