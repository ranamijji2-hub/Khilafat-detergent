import { getSettings } from '@/lib/settings';
import ContactForm from '@/components/ContactForm';
import ContactSection from '@/components/ContactSection';

export async function generateMetadata() {
  return {
    title: 'Contact Us',
    description:
      'Get in touch with Khilafat Detergent (RH & Sons). Call, email or WhatsApp us, or send a message — we reply fast and deliver Cash on Delivery across Pakistan.',
    alternates: { canonical: '/contact' },
  };
}

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div>
      <section className="water-bg px-4 py-14 text-center sm:py-16">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">Contact Us</span>
        <h1 className="mx-auto mt-2 max-w-2xl font-heading text-4xl font-extrabold text-ink">
          We'd Love to Hear From You
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink/60">
          Questions about an order, bulk pricing, or distribution? Send us a message and our team will respond promptly.
        </p>
      </section>

      <div className="mx-auto max-w-xl px-4 py-4">
        <ContactForm />
      </div>

      <ContactSection settings={settings} />
    </div>
  );
}
