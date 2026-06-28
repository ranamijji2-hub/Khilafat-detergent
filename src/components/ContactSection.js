import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactSection({ settings }) {
  return (
    <section className="bg-[#f6f9ff] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">Get In Touch</span>
          <h2 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">Visit or Reach Us Anytime</h2>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard icon={MapPin} title="Our Location" text={settings.contact.address} />
            <InfoCard icon={Phone} title="Call Us" text={settings.contact.phone} href={`tel:${settings.contact.phone.replace(/\s/g, '')}`} />
            <InfoCard icon={Mail} title="Email Us" text={settings.contact.email} href={`mailto:${settings.contact.email}`} />
            <InfoCard icon={Clock} title="Support Hours" text="24/7 — Every day of the week" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-card">
            <iframe
              title="Khilafat Detergent location map"
              src={settings.contact.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ minHeight: 320, border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, text, href }) {
  const content = (
    <div className="flex h-full items-start gap-3 rounded-2xl bg-white p-5 shadow-card">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon size={20} />
      </span>
      <div>
        <div className="text-sm font-bold text-ink">{title}</div>
        <div className="mt-0.5 text-sm text-ink/60">{text}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
