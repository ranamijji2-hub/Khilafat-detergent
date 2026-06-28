import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Add Product', robots: { index: false } };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink">Add Product</h1>
      <p className="mt-1 text-sm text-ink/55">Create a new Khilafat Detergent pack listing.</p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
