import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Phone, MapPin, Package } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';

export const revalidate = 0;

export async function generateMetadata() {
  return { title: 'Order Confirmed', robots: { index: false, follow: false } };
}

export default async function OrderConfirmationPage({ params }) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  const settings = await getSettings();

  return (
    <div className="water-bg min-h-[70vh] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 size={36} className="text-green-600" />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-extrabold text-ink sm:text-3xl">Order Placed Successfully!</h1>
          <p className="mt-2 text-sm text-ink/60">
            Thank you, {order.customerName}. Your order has been received and will be delivered with Cash on Delivery.
          </p>
          <div className="mt-4 rounded-full bg-primary/10 px-5 py-2 font-heading text-sm font-bold text-primary">
            Order #{order.orderNumber}
          </div>
        </div>

        <div className="mt-8 space-y-3 rounded-xl bg-[#f6f9ff] p-5">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span className="text-ink/70">{it.name} ({it.size}) × {it.qty}</span>
              <span className="font-semibold text-ink">Rs. {(it.price * it.qty).toFixed(0)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-primary/10 pt-3 text-base">
            <span className="font-bold text-ink">Total</span>
            <span className="font-heading font-extrabold text-primary">Rs. {order.total.toFixed(0)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-sm text-ink/65 sm:grid-cols-2">
          <div className="flex items-start gap-2"><Package size={16} className="mt-0.5 shrink-0 text-primary" /> Payment: Cash on Delivery</div>
          <div className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-primary" /> {order.address}</div>
        </div>

        <p className="mt-6 text-center text-xs text-ink/45">
          Need help with your order? Call us at{' '}
          <a href={`tel:${settings.contact.phone.replace(/\s/g, '')}`} className="font-semibold text-primary">
            {settings.contact.phone}
          </a>
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/products" className="btn-primary rounded-full px-7 py-3 text-center text-sm font-bold">
            Continue Shopping
          </Link>
          <Link href="/" className="rounded-full border-2 border-primary px-7 py-3 text-center text-sm font-bold text-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
