import { NextResponse } from 'next/server';
import slugify from 'slugify';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { validateProductPayload, sanitizeText } from '@/lib/validate';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  const where = {};
  if (category) where.category = category;
  if (featured === 'true') where.featured = true;

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  return NextResponse.json({ products });
}

export async function POST(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { valid, errors } = validateProductPayload(body);
  if (!valid) return NextResponse.json({ errors }, { status: 400 });

  const baseSlug = slugify(`${body.name}-${body.size}`, { lower: true, strict: true });
  let slug = baseSlug;
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const product = await prisma.product.create({
    data: {
      name: sanitizeText(body.name, 150),
      slug,
      description: sanitizeText(body.description, 4000),
      category: sanitizeText(body.category || 'Detergent Powder', 80),
      size: sanitizeText(body.size, 30),
      price: Number(body.price),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      sku: body.sku ? sanitizeText(body.sku, 60) : null,
      image: body.image || null,
      gallery: body.gallery ? JSON.stringify(body.gallery) : null,
      inStock: body.inStock !== false,
      featured: !!body.featured,
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
      metaTitle: body.metaTitle ? sanitizeText(body.metaTitle, 160) : null,
      metaDescription: body.metaDescription ? sanitizeText(body.metaDescription, 300) : null,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
