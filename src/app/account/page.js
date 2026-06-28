import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, ShoppingBag, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'My Account',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  dispatched: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-ink">My Account</h1>
          <p className="mt-1 text-sm text-ink/55">
            Welcome back, {user?.firstName || 'Customer'}!
          </p>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-primary/5 p-5 text-center">
          <div className="font-heading text-2xl font-extrabold text-primary">{orders.length}</div>
          <div className="mt-1 text-sm text-ink/55">Total Orders</div>
        </div>
        <div className="rounded-2xl bg-green-50 p-5 text-center">
          <div className="font-heading text-2xl font-extrabold text-green-600">
            {orders.filter((o) => o.status === 'delivered').length}
          </div>
          <div className="mt-1 text-sm text-ink/55">Delivered</div>
        </div>
        <div className="rounded-2xl bg-yellow-50 p-5 text-center col-span-2 sm:col-span-1">
          <div className="font-heading text-2xl font-extrabold text-yellow-600">
            {orders.filter((o) => ['pending', 'confirmed', 'dispatched'].includes(o.status)).length}
          </div>
          <div className="mt-1 text-sm text-ink/55">In Progress</div>
        </div>
      </div>

      {/* Orders */}
      <div className="mt-10">
        <h2 className="font-heading text-xl font-bold text-ink mb-4">Order History</h2>

        {orders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="font-heading text-lg font-bold text-ink/40">No orders yet</p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-ink">{order.orderNumber}</p>
                    <p className="text-sm text-ink/50">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <p key={item.id} className="text-sm text-ink/65">
                      {item.qty}× {item.name} ({item.size}) — Rs. {(item.price * item.qty).toFixed(0)}
                    </p>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-sm font-bold text-ink">Total: Rs. {order.total.toFixed(0)}</span>
                  <Link
                    href={`/order-confirmation/${order.orderNumber}`}
                    className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    <Package size={14} /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
