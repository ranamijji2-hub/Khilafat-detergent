'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Trash2 } from 'lucide-react';
import ImageUploader from './ImageUploader';

const SIZE_OPTIONS = ['50g', '100g', '500g', '1kg', '5kg'];

export default function ProductForm({ initial, productId }) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [form, setForm] = useState({
    name: initial?.name || 'Khilafat Detergent Powder',
    description: initial?.description || '',
    category: initial?.category || 'Detergent Powder',
    size: initial?.size || '1kg',
    price: initial?.price ?? '',
    compareAtPrice: initial?.compareAtPrice ?? '',
    sku: initial?.sku || '',
    image: initial?.image || '',
    inStock: initial?.inStock ?? true,
    featured: initial?.featured ?? false,
    sortOrder: initial?.sortOrder ?? 0,
    metaTitle: initial?.metaTitle || '',
    metaDescription: initial?.metaDescription || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await fetch(isEdit ? `/api/products/${productId}` : '/api/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { form: data.error || 'Failed to save.' });
        setSaving(false);
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } catch {
      setErrors({ form: 'Network error — please try again.' });
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    router.push('/admin/products');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card lg:col-span-2">
        <Field label="Product Name" error={errors.name}>
          <input required value={form.name} onChange={set('name')} className="input" />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea required rows={4} value={form.description} onChange={set('description')} className="input" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <input value={form.category} onChange={set('category')} className="input" />
          </Field>
          <Field label="Size" error={errors.size}>
            <select value={form.size} onChange={set('size')} className="input">
              {SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price (Rs.)" error={errors.price}>
            <input required type="number" min="0" step="0.01" value={form.price} onChange={set('price')} className="input" />
          </Field>
          <Field label="Compare-at Price (optional)">
            <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={set('compareAtPrice')} className="input" />
          </Field>
          <Field label="SKU (optional)">
            <input value={form.sku} onChange={set('sku')} className="input" />
          </Field>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink/70">
            <input type="checkbox" checked={form.inStock} onChange={set('inStock')} className="h-4 w-4 accent-[var(--color-primary)]" />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink/70">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 accent-[var(--color-primary)]" />
            Featured / Best Seller
          </label>
        </div>

        <hr className="border-gray-100" />
        <h3 className="font-heading text-sm font-bold text-ink">SEO (optional — leave blank to auto-generate)</h3>
        <Field label="Meta Title">
          <input value={form.metaTitle} onChange={set('metaTitle')} className="input" maxLength={160} />
        </Field>
        <Field label="Meta Description">
          <textarea rows={2} value={form.metaDescription} onChange={set('metaDescription')} className="input" maxLength={300} />
        </Field>

        {errors.form && <p className="text-sm font-semibold text-red-500">{errors.form}</p>}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
          <ImageUploader label="Product Image" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          <div className="mt-4">
            <Field label="Sort Order">
              <input type="number" value={form.sortOrder} onChange={set('sortOrder')} className="input" />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-red-200 px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            <Trash2 size={16} /> {deleting ? 'Deleting…' : 'Delete Product'}
          </button>
        )}
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
    </form>
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
