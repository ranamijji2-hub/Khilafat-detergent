import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0;

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: 'Shop All Products',
    description: `Browse all Khilafat Detergent packs — 50g, 100g, 500g, 1kg and 5kg. ${settings.seo.defaultDescription}`,
    alternates: { canonical: '/products' },
  };
}

export default async function ProductsPage({ searchParams }) {
  const activeCategory = searchParams?.category || null;

  const allProducts = await prisma.product.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
  const categories = Array.from(new Set(allProducts.map((p) => p.category)));
  const products = activeCategory ? allProducts.filter((p) => p.category === activeCategory) : allProducts;

  return (
    <div className="water-bg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">Shop</span>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-ink sm:text-4xl">All Products</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink/60">
            Khilafat Detergent Powder — advance cleaning power in every pack size, from try-me sachets to bulk family packs.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link
            href="/products"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              !activeCategory ? 'bg-primary text-white' : 'bg-white text-ink/70 shadow-card hover:bg-primary/5'
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeCategory === c ? 'bg-primary text-white' : 'bg-white text-ink/70 shadow-card hover:bg-primary/5'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-center text-ink/50">No products found in this category yet.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
