import Link from 'next/link';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink/55">Manage all Khilafat Detergent pack sizes, prices and images.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Size</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Featured</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/40">No products yet. Add your first one.</td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0">
                <td className="flex items-center gap-3 px-5 py-3">
                  <img src={p.image || '/images/products/khilafat-1kg.webp'} alt={p.name} className="h-10 w-10 rounded-md border border-gray-100 object-contain bg-white" />
                  <span className="font-semibold text-ink">{p.name}</span>
                </td>
                <td className="px-5 py-3 text-ink/70">{p.size}</td>
                <td className="px-5 py-3 font-bold text-ink">Rs. {p.price}</td>
                <td className="px-5 py-3">
                  {p.inStock ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600"><Check size={14} /> In Stock</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500"><X size={14} /> Out of Stock</span>
                  )}
                </td>
                <td className="px-5 py-3">{p.featured ? '⭐' : '—'}</td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20">
                    <Pencil size={13} /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
