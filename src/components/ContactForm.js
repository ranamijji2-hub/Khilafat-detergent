'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { message: data.error || 'Something went wrong.' });
        setStatus('error');
        return;
      }
      setStatus('done');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
      setErrors({ message: 'Network error. Please try again.' });
    }
  };

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-green-50 p-10 text-center">
        <CheckCircle2 size={40} className="text-green-600" />
        <h3 className="font-heading text-lg font-bold text-ink">Message Sent!</h3>
        <p className="text-sm text-ink/60">Thanks for reaching out — our team will get back to you shortly.</p>
        <button onClick={() => setStatus('idle')} className="mt-2 text-sm font-bold text-primary">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
      <Field label="Full Name" error={errors.name}>
        <input
          required
          value={form.name}
          onChange={update('name')}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          placeholder="Your name"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input
            value={form.phone}
            onChange={update('phone')}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder="03xx-xxxxxxx"
          />
        </Field>
      </div>
      <Field label="Message" error={errors.message}>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update('message')}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          placeholder="How can we help?"
        />
      </Field>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold disabled:opacity-60"
      >
        <Send size={16} /> {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
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
