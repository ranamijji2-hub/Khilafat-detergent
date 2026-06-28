import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import WhyChooseUs from '@/components/WhyChooseUs';
import LaundryGraphic from '@/components/LaundryGraphic';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: 'About Us',
    description: `Learn about ${settings.companyName}, makers of Khilafat Detergent — our story, mission and commitment to premium-quality, affordable cleaning products in Pakistan.`,
    alternates: { canonical: '/about' },
  };
}

export default async function AboutPage() {
  const settings = await getSettings();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: `${SITE_URL}/about` },
    ],
  };

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd} />

      <section className="water-bg px-4 py-16 text-center sm:py-20">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary">About {settings.companyName}</span>
        <h1 className="mx-auto mt-2 max-w-2xl font-heading text-4xl font-extrabold text-ink sm:text-5xl">
          {settings.about.heading}
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <LaundryGraphic />
          <div>
            <p className="text-base leading-relaxed text-ink/70">{settings.about.body}</p>
            <div className="mt-6 rounded-2xl border-l-4 border-accent bg-primary/5 p-5">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-primary">Our Mission</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{settings.about.mission}</p>
            </div>
            <Link href="/products" className="mt-7 inline-flex items-center gap-2 font-bold text-primary hover:text-primary-dark">
              Explore Our Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs items={settings.whyChooseUs} />

      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-24">
        <h2 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Trusted Since {settings.about.foundedYear}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink/60">
          From a single neighbourhood formula to a household name across Punjab and beyond — {settings.companyName} continues
          to grow by keeping one promise: cleaning power you can trust, at a price every family can afford.
        </p>
        <Link href="/contact" className="btn-primary mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold shadow-soft">
          Get In Touch
        </Link>
      </section>
    </div>
  );
}
