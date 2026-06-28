import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { validateProductPayload, sanitizeText } from '@/lib/validate';

export async function GET(req, { params }) {
  const product = await prisma.product.findUnique({ where: { id: Number(params.id) } });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { valid, errors } = validateProductPayload(body);
  if (!valid) return NextResponse.json({ errors }, { status: 400 });

  try {
    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data: {
        name: sanitizeText(body.name, 150),
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
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.product.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
