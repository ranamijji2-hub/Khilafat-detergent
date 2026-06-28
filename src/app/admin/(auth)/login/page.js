'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error — please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-soft">
      <div className="text-center">
        <img src="/images/brand/logo.png" alt="Khilafat Detergent" className="mx-auto h-14 w-14 rounded-xl" />
        <h1 className="mt-4 font-heading text-xl font-extrabold text-ink">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-ink/55">Sign in to manage your website</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">Username</label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-primary">
            <User size={16} className="text-ink/40" />
            <input
              required
              autoFocus
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              className="w-full text-sm outline-none"
              placeholder="admin"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/50">Password</label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 focus-within:border-primary">
            <Lock size={16} className="text-ink/40" />
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full text-sm outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
