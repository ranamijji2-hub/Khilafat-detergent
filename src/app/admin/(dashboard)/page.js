import Link from 'next/link';
import { Package, ShoppingBag, Clock3, Banknote, Plus, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

async function getStats() {
  const [productCount, orderCount, pendingCount, revenue, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 6, include: { items: true } }),
  ]);
  return {
    productCount,
    orderCount,
    pendingCount,
    revenue: revenue._sum.total || 0,
    recentOrders,
  };
}

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  dispatched: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Orders', value: stats.orderCount, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending Orders', value: stats.pendingCount, icon: Clock3, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Products', value: stats.productCount, icon: Package, color: 'bg-violet-50 text-violet-600' },
    { label: 'Total Revenue', value: `Rs. ${stats.revenue.toFixed(0)}`, icon: Banknote, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-ink/55">Welcome back — here's what's happening with your store.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.color}`}>
              <c.icon size={22} />
            </span>
            <div className="mt-3 font-heading text-2xl font-extrabold text-ink">{c.value}</div>
            <div className="text-xs font-semibold text-ink/50">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-sm font-bold text-primary">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wide text-ink/40">
                <th className="py-2">Order #</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Items</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ink/40">No orders yet.</td>
                </tr>
              )}
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 font-semibold text-ink">
                    <Link href={`/admin/orders/${o.id}`} className="hover:text-primary">{o.orderNumber}</Link>
                  </td>
                  <td className="py-3 text-ink/70">{o.customerName}</td>
                  <td className="py-3 text-ink/50">{o.items.length} item(s)</td>
                  <td className="py-3 font-bold text-ink">Rs. {o.total.toFixed(0)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${STATUS_STYLES[o.status] || 'bg-gray-100 text-gray-600'}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
