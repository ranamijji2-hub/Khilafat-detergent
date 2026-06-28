'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, X, Eye, EyeOff } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

const EMPTY = {
  title: '',
  subtitle: '',
  urduLine1: '',
  urduLine2: '',
  image: '',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  active: true,
  sortOrder: 0,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/banners?all=true');
    const data = await res.json();
    setBanners(data.banners || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const startEdit = (banner) => {
    setEditingId(banner.id);
    setForm({ ...EMPTY, ...banner });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      setError('Title and image are required.');
      return;
    }
    setSaving(true);
    setError('');
    const res = await fetch(editingId ? `/api/banners/${editingId}` : '/api/banners', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to save banner.');
      setSaving(false);
      return;
    }
    setSaving(false);
    resetForm();
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner slide?')) return;
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    load();
  };

  const toggleActive = async (banner) => {
    await fetch(`/api/banners/${banner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...banner, active: !banner.active }),
    });
    load();
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink">Homepage Banners</h1>
      <p className="mt-1 text-sm text-ink/55">Manage the hero slider shown on your homepage.</p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-card lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="font-heading text-sm font-bold text-ink">{editingId ? 'Edit Slide' : 'New Slide'}</h2>
          <Field label="Title">
            <input required value={form.title} onChange={set('title')} className="input" placeholder="Khilafat Detergent" />
          </Field>
          <Field label="Subtitle">
            <input value={form.subtitle} onChange={set('subtitle')} className="input" placeholder="Advance Cleaning Power..." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Urdu Line 1 (optional)">
              <input dir="rtl" value={form.urduLine1} onChange={set('urduLine1')} className="input" />
            </Field>
            <Field label="Urdu Line 2 (optional)">
              <input dir="rtl" value={form.urduLine2} onChange={set('urduLine2')} className="input" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button Text">
              <input value={form.ctaText} onChange={set('ctaText')} className="input" />
            </Field>
            <Field label="Button Link">
              <input value={form.ctaLink} onChange={set('ctaLink')} className="input" />
            </Field>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <input type="checkbox" checked={form.active} onChange={set('active')} className="h-4 w-4 accent-[var(--color-primary)]" /> Active
            </label>
            <Field label="Sort Order">
              <input type="number" value={form.sortOrder} onChange={set('sortOrder')} className="input w-24" />
            </Field>
          </div>
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        </div>

        <div className="space-y-4">
          <ImageUploader label="Slide Image" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {editingId ? 'Update' : 'Add Slide'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-full border-2 border-gray-200 px-4 py-2.5 text-sm font-bold text-ink/60">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="font-heading text-sm font-bold text-ink">All Slides</h2>
        {loading ? (
          <p className="mt-4 text-sm text-ink/50">Loading…</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((b) => (
              <div key={b.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
                <img src={b.image} alt={b.title} className="h-36 w-full bg-primary/5 object-contain p-3" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-sm font-bold text-ink">{b.title}</h3>
                    {b.active ? (
                      <span className="text-xs font-bold text-green-600">Active</span>
                    ) : (
                      <span className="text-xs font-bold text-ink/40">Hidden</span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink/55">{b.subtitle}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => startEdit(b)} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                      <Pencil size={12} /> Edit
                    </button>
                    <button onClick={() => toggleActive(b)} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-ink/60">
                      {b.active ? <EyeOff size={12} /> : <Eye size={12} />} {b.active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">{label}</label>
      {children}
    </div>
  );
}
