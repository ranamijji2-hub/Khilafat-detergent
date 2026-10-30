import { prisma } from '@/lib/prisma';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rhasons.com.pk').replace(/\/+$/, '');

export default async function sitemap() {
  let products = [];
  try {
    products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });
  } catch {
    products = [];
  }

  const staticRoutes = ['', '/products', '/about', '/contact'].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));

  const productRoutes = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
