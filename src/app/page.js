import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import HeroSlider from '@/components/HeroSlider';
import WhyChooseUs from '@/components/WhyChooseUs';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';
import FaqAccordion from '@/components/FaqAccordion';
import ContactSection from '@/components/ContactSection';
import LaundryGraphic from '@/components/LaundryGraphic';
import { ArrowRight, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const settings = await getSettings();
  const [banners, products] = await Promise.all([
    prisma.banner.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
  ]);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <>
      <HeroSlider banners={banners} />

      <WhyChooseUs items={settings.whyChooseUs} />

      {/* Company introduction */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">{settings.companyName}</span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">{settings.about.heading}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/65">{settings.about.body}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Stat value={`${new Date().getFullYear() - Number(settings.about.foundedYear)}+`} label="Years of Trust" />
              <Stat value="5" label="Pack Sizes" />
              <Stat value="100%" label="Cash on Delivery" />
            </div>
            <Link href="/about" className="mt-7 inline-flex items-center gap-2 font-bold text-primary hover:text-primary-dark">
              Learn More About Us <ArrowRight size={18} />
            </Link>
          </div>
          <LaundryGraphic />
        </div>
      </section>

      {/* Available sizes / featured products */}
      <section className="water-bg py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-secondary">
              <Sparkles size={14} /> Our Products
            </span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">Available in Multiple Sizes</h2>
            <div className="mx-auto mt-3 h-1.5 w-16 rounded-full bg-accent" />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold shadow-soft">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">Shop by Category</span>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">Product Categories</h2>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {categories.map((c) => (
              <Link
                key={c}
                href={`/products?category=${encodeURIComponent(c)}`}
                className="rounded-2xl border border-primary/15 bg-white px-8 py-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="font-heading text-lg font-bold text-primary">{c}</div>
                <div className="mt-1 text-xs text-ink/50">
                  {products.filter((p) => p.category === c).length} sizes available
                </div>
              </Link>
            ))}
            <div className="rounded-2xl border border-dashed border-primary/20 bg-white/50 px-8 py-6 text-center text-ink/40">
              <div className="font-heading text-lg font-bold">More Coming Soon</div>
              <div className="mt-1 text-xs">New categories added from Admin Panel</div>
            </div>
          </div>
        </section>
      )}

      <Testimonials testimonials={settings.testimonials} />
      <FaqAccordion faqs={settings.faqs} />
      <ContactSection settings={settings} />
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl bg-primary/5 px-3 py-4 text-center">
      <div className="font-heading text-xl font-extrabold text-primary">{value}</div>
      <div className="mt-0.5 text-[11px] font-medium text-ink/50">{label}</div>
    </div>
  );
}
