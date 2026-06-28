'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

const TABS = ['Contact', 'Social', 'Theme', 'SEO', 'About', 'Why Choose Us', 'Testimonials', 'FAQs'];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [tab, setTab] = useState('Contact');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings));
  }, []);

  if (!settings) return <p className="text-sm text-ink/50">Loading…</p>;

  const update = (path, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-ink">Settings</h1>
          <p className="mt-1 text-sm text-ink/55">Everything here updates the live website instantly.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold disabled:opacity-60">
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-gray-200 pb-px">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        {tab === 'Contact' && <ContactTab settings={settings} update={update} />}
        {tab === 'Social' && <SocialTab settings={settings} update={update} />}
        {tab === 'Theme' && <ThemeTab settings={settings} update={update} />}
        {tab === 'SEO' && <SeoTab settings={settings} update={update} />}
        {tab === 'About' && <AboutTab settings={settings} update={update} />}
        {tab === 'Why Choose Us' && <WhyChooseUsTab settings={settings} setSettings={setSettings} />}
        {tab === 'Testimonials' && <TestimonialsTab settings={settings} setSettings={setSettings} />}
        {tab === 'FAQs' && <FaqsTab settings={settings} setSettings={setSettings} />}
      </div>

      <style jsx global>{`
        .s-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
        }
        .s-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .s-label {
          display: block;
          margin-bottom: 0.375rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: rgba(12, 27, 51, 0.5);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="s-label">{label}</label>
      {children}
    </div>
  );
}

function ContactTab({ settings, update }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Site Name">
        <input className="s-input" value={settings.siteName} onChange={(e) => update('siteName', e.target.value)} />
      </Field>
      <Field label="Company Name">
        <input className="s-input" value={settings.companyName} onChange={(e) => update('companyName', e.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Tagline">
          <input className="s-input" value={settings.tagline} onChange={(e) => update('tagline', e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Address">
          <input className="s-input" value={settings.contact.address} onChange={(e) => update('contact.address', e.target.value)} />
        </Field>
      </div>
      <Field label="Phone">
        <input className="s-input" value={settings.contact.phone} onChange={(e) => update('contact.phone', e.target.value)} />
      </Field>
      <Field label="WhatsApp Number (with country code)">
        <input className="s-input" value={settings.contact.whatsapp} onChange={(e) => update('contact.whatsapp', e.target.value)} />
      </Field>
      <Field label="Email">
        <input className="s-input" value={settings.contact.email} onChange={(e) => update('contact.email', e.target.value)} />
      </Field>
      <Field label="Google Maps Embed URL">
        <input className="s-input" value={settings.contact.mapEmbedUrl} onChange={(e) => update('contact.mapEmbedUrl', e.target.value)} />
      </Field>
    </div>
  );
}

function SocialTab({ settings, update }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Facebook URL">
        <input className="s-input" value={settings.social.facebook} onChange={(e) => update('social.facebook', e.target.value)} />
      </Field>
      <Field label="Instagram URL">
        <input className="s-input" value={settings.social.instagram} onChange={(e) => update('social.instagram', e.target.value)} />
      </Field>
      <Field label="YouTube URL">
        <input className="s-input" value={settings.social.youtube} onChange={(e) => update('social.youtube', e.target.value)} />
      </Field>
    </div>
  );
}

function ThemeTab({ settings, update }) {
  const colors = [
    { key: 'primary', label: 'Primary' },
    { key: 'primaryDark', label: 'Primary Dark' },
    { key: 'secondary', label: 'Secondary' },
    { key: 'accent', label: 'Accent (Gold)' },
    { key: 'ink', label: 'Text / Ink' },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-sm font-bold text-ink">Brand Colors</h3>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {colors.map((c) => (
            <div key={c.key}>
              <label className="s-label">{c.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.theme[c.key]}
                  onChange={(e) => update(`theme.${c.key}`, e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-gray-200"
                />
                <input
                  className="s-input"
                  value={settings.theme[c.key]}
                  onChange={(e) => update(`theme.${c.key}`, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Heading Font (Google Fonts name)">
          <input className="s-input" value={settings.theme.fontHeading} onChange={(e) => update('theme.fontHeading', e.target.value)} />
        </Field>
        <Field label="Body Font (Google Fonts name)">
          <input className="s-input" value={settings.theme.fontBody} onChange={(e) => update('theme.fontBody', e.target.value)} />
        </Field>
      </div>
      <p className="text-xs text-ink/45">Tip: use exact Google Fonts names like "Poppins", "Nunito Sans", "Roboto" or "Montserrat".</p>
    </div>
  );
}

function SeoTab({ settings, update }) {
  return (
    <div className="space-y-4">
      <Field label="Default Page Title">
        <input className="s-input" value={settings.seo.defaultTitle} onChange={(e) => update('seo.defaultTitle', e.target.value)} />
      </Field>
      <Field label="Title Template (use %s for page title)">
        <input className="s-input" value={settings.seo.titleTemplate} onChange={(e) => update('seo.titleTemplate', e.target.value)} />
      </Field>
      <Field label="Default Meta Description">
        <textarea rows={3} className="s-input" value={settings.seo.defaultDescription} onChange={(e) => update('seo.defaultDescription', e.target.value)} />
      </Field>
      <Field label="Keywords (comma-separated)">
        <textarea rows={2} className="s-input" value={settings.seo.keywords} onChange={(e) => update('seo.keywords', e.target.value)} />
      </Field>
      <Field label="Default Social Share Image (Open Graph / Twitter)">
        <ImageUploader value={settings.seo.ogImage} onChange={(url) => update('seo.ogImage', url)} label="" />
      </Field>
    </div>
  );
}

function AboutTab({ settings, update }) {
  return (
    <div className="space-y-4">
      <Field label="About Heading">
        <input className="s-input" value={settings.about.heading} onChange={(e) => update('about.heading', e.target.value)} />
      </Field>
      <Field label="About Body">
        <textarea rows={4} className="s-input" value={settings.about.body} onChange={(e) => update('about.body', e.target.value)} />
      </Field>
      <Field label="Mission Statement">
        <textarea rows={2} className="s-input" value={settings.about.mission} onChange={(e) => update('about.mission', e.target.value)} />
      </Field>
      <Field label="Founded Year">
        <input className="s-input w-32" value={settings.about.foundedYear} onChange={(e) => update('about.foundedYear', e.target.value)} />
      </Field>
    </div>
  );
}

function WhyChooseUsTab({ settings, setSettings }) {
  const items = settings.whyChooseUs;

  const updateItem = (i, field, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.whyChooseUs[i][field] = value;
      return next;
    });
  };
  const addItem = () => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.whyChooseUs.push({ icon: 'sparkles', title: 'New Feature', text: 'Describe this feature.' });
      return next;
    });
  };
  const removeItem = (i) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.whyChooseUs.splice(i, 1);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-gray-100 p-4 sm:grid-cols-[120px_1fr_2fr_auto]">
          <Field label="Icon key">
            <input className="s-input" value={item.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)} placeholder="flask/shirt/leaf/badge" />
          </Field>
          <Field label="Title">
            <input className="s-input" value={item.title} onChange={(e) => updateItem(i, 'title', e.target.value)} />
          </Field>
          <Field label="Text">
            <input className="s-input" value={item.text} onChange={(e) => updateItem(i, 'text', e.target.value)} />
          </Field>
          <button onClick={() => removeItem(i)} className="self-end rounded-full bg-red-50 p-2.5 text-red-500"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
        <Plus size={14} /> Add Feature
      </button>
    </div>
  );
}

function TestimonialsTab({ settings, setSettings }) {
  const items = settings.testimonials;

  const updateItem = (i, field, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.testimonials[i][field] = value;
      return next;
    });
  };
  const addItem = () => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.testimonials.push({ name: 'Customer Name', location: 'City', rating: 5, text: 'Great product!' });
      return next;
    });
  };
  const removeItem = (i) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.testimonials.splice(i, 1);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {items.map((t, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-gray-100 p-4 sm:grid-cols-[1fr_1fr_80px_auto]">
          <Field label="Name">
            <input className="s-input" value={t.name} onChange={(e) => updateItem(i, 'name', e.target.value)} />
          </Field>
          <Field label="Location">
            <input className="s-input" value={t.location} onChange={(e) => updateItem(i, 'location', e.target.value)} />
          </Field>
          <Field label="Rating (1-5)">
            <input type="number" min={1} max={5} className="s-input" value={t.rating} onChange={(e) => updateItem(i, 'rating', Number(e.target.value))} />
          </Field>
          <button onClick={() => removeItem(i)} className="self-end rounded-full bg-red-50 p-2.5 text-red-500"><Trash2 size={14} /></button>
          <div className="sm:col-span-4">
            <Field label="Testimonial Text">
              <textarea rows={2} className="s-input" value={t.text} onChange={(e) => updateItem(i, 'text', e.target.value)} />
            </Field>
          </div>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
        <Plus size={14} /> Add Testimonial
      </button>
    </div>
  );
}

function FaqsTab({ settings, setSettings }) {
  const items = settings.faqs;

  const updateItem = (i, field, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.faqs[i][field] = value;
      return next;
    });
  };
  const addItem = () => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.faqs.push({ question: 'New question?', answer: 'Answer goes here.' });
      return next;
    });
  };
  const removeItem = (i) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      next.faqs.splice(i, 1);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {items.map((f, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-gray-100 p-4">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Field label="Question">
                <input className="s-input" value={f.question} onChange={(e) => updateItem(i, 'question', e.target.value)} />
              </Field>
            </div>
            <button onClick={() => removeItem(i)} className="mt-6 rounded-full bg-red-50 p-2.5 text-red-500"><Trash2 size={14} /></button>
          </div>
          <Field label="Answer">
            <textarea rows={2} className="s-input" value={f.answer} onChange={(e) => updateItem(i, 'answer', e.target.value)} />
          </Field>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
        <Plus size={14} /> Add FAQ
      </button>
    </div>
  );
}
