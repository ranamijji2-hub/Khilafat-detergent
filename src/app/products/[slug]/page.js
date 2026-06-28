import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Check, X } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import AddToCartBox from '@/components/AddToCartBox';
import ProductCard from '@/components/ProductCard';
import JsonLd from '@/components/JsonLd';

export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getProduct(slug) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return {};

  const title = product.metaTitle || `${product.name} ${product.size} | Buy Online`;
  const description =
    product.metaDescription || product.description.slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: product.image || '/images/brand/og-image.jpg' }],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const settings = await getSettings();
  const related = await prisma.product.findMany({
    where: { category: product.category, NOT: { id: product.id } },
    orderBy: { sortOrder: 'asc' },
    take: 4,
  });

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name} ${product.size}`,
    description: product.description,
    image: `${SITE_URL}${product.image || '/images/brand/og-image.jpg'}`,
    sku: product.sku || `KD-${product.size}`,
    brand: { '@type': 'Brand', name: 'Khilafat Detergent' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'PKR',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: `${product.name} ${product.size}`, item: `${SITE_URL}/products/${product.slug}` },
    ],
  };

  return (
    <div className="water-bg">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-ink/50">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-primary">Products</Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-ink/70">{product.name} {product.size}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex items-center justify-center rounded-2xl bg-white p-10 shadow-card">
            <img
              src={product.image || '/images/products/khilafat-1kg.webp'}
              alt={`Khilafat Detergent Powder ${product.size} pack`}
              className="w-full max-w-xs"
            />
          </div>

          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{product.category}</span>
            <h1 className="mt-3 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
              {product.name} <span className="text-secondary">— {product.size}</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink/65">{product.description}</p>

            <div className="mt-5 flex items-center gap-4">
              <span className="font-heading text-3xl font-extrabold text-primary">Rs. {product.price}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-ink/40 line-through">Rs. {product.compareAtPrice}</span>
              )}
              <span className={`flex items-center gap-1 text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? <Check size={16} /> : <X size={16} />}
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="mt-6">
              <AddToCartBox product={product} whatsapp={settings.contact.whatsapp} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-extrabold text-ink">Other Sizes You May Like</h2>
            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
