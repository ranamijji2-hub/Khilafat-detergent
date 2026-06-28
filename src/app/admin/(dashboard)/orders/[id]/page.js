'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, StickyNote, Loader2 } from 'lucide-react';

const STATUSES = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/orders/${id}`);
    if (res.ok) {
      const data = await res.json();
      setOrder(data.order);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateStatus = async (status) => {
    setSaving(true);
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    await load();
    setSaving(false);
  };

  if (!order) return <p className="text-sm text-ink/50">Loading…</p>;

  return (
    <div>
      <button onClick={() => router.push('/admin/orders')} className="mb-4 flex items-center gap-1.5 text-sm font-bold text-primary">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-extrabold text-ink">Order {order.orderNumber}</h1>
        <div className="flex items-center gap-2">
          {saving && <Loader2 size={16} className="animate-spin text-primary" />}
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm font-bold capitalize outline-none focus:border-primary"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="font-heading text-sm font-bold text-ink">Items</h2>
          <div className="divide-y divide-gray-50">
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-ink/70">{it.name} ({it.size}) × {it.qty}</span>
                <span className="font-bold text-ink">Rs. {(it.price * it.qty).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-4 text-base">
            <span className="font-bold text-ink">Total</span>
            <span className="font-heading font-extrabold text-primary">Rs. {order.total.toFixed(0)}</span>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
          <h2 className="font-heading text-sm font-bold text-ink">Customer</h2>
          <p className="font-semibold text-ink">{order.customerName}</p>
          <div className="flex items-center gap-2 text-sm text-ink/65"><Phone size={14} /> {order.phone}</div>
          {order.email && <div className="flex items-center gap-2 text-sm text-ink/65"><Mail size={14} /> {order.email}</div>}
          <div className="flex items-start gap-2 text-sm text-ink/65"><MapPin size={14} className="mt-0.5" /> {order.address}</div>
          {order.notes && (
            <div className="flex items-start gap-2 text-sm text-ink/65"><StickyNote size={14} className="mt-0.5" /> {order.notes}</div>
          )}
          <p className="pt-2 text-xs text-ink/40">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
