'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const STATUSES = ['all', 'pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  dispatched: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const pageSize = 15;

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, pageSize, status });
    if (q) params.set('q', q);
    const res = await fetch(`/api/orders?${params.toString()}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, status, q]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const exportUrl = `/api/orders/export${status !== 'all' ? `?status=${status}` : ''}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">Orders</h1>
          <p className="mt-1 text-sm text-ink/55">{total} order(s) total</p>
        </div>
        <a href={exportUrl} className="btn-accent flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold">
          <Download size={16} /> Export to Excel
        </a>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2">
          <Search size={16} className="text-ink/40" />
          <input
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
            placeholder="Search order #, name, phone, email…"
            className="w-64 text-sm outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setPage(1); setStatus(s); }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
                status === s ? 'bg-primary text-white' : 'bg-white text-ink/60 shadow-card'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3">Order #</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-ink/40">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-ink/40">No orders found.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 font-semibold text-ink">{o.orderNumber}</td>
                  <td className="px-5 py-3 text-ink/50">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-ink/70">{o.customerName}</td>
                  <td className="px-5 py-3 text-ink/70">{o.phone}</td>
                  <td className="px-5 py-3 font-bold text-ink">Rs. {o.total.toFixed(0)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${STATUS_STYLES[o.status] || 'bg-gray-100 text-gray-600'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                      <Eye size={13} /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-full bg-white p-2 shadow-card disabled:opacity-40">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-ink/60">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-full bg-white p-2 shadow-card disabled:opacity-40">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
