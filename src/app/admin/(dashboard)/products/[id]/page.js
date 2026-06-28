import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Edit Product', robots: { index: false } };
export const revalidate = 0;

export default async function EditProductPage({ params }) {
  const product = await prisma.product.findUnique({ where: { id: Number(params.id) } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink">Edit Product</h1>
      <p className="mt-1 text-sm text-ink/55">{product.name} — {product.size}</p>
      <div className="mt-6">
        <ProductForm initial={product} productId={product.id} />
      </div>
    </div>
  );
}
