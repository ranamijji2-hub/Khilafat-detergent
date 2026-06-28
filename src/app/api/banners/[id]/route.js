import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText } from '@/lib/validate';

export async function PUT(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const banner = await prisma.banner.update({
    where: { id: Number(params.id) },
    data: {
      title: sanitizeText(body.title, 150),
      subtitle: body.subtitle ? sanitizeText(body.subtitle, 200) : null,
      urduLine1: body.urduLine1 ? sanitizeText(body.urduLine1, 200) : null,
      urduLine2: body.urduLine2 ? sanitizeText(body.urduLine2, 200) : null,
      image: body.image,
      ctaText: body.ctaText ? sanitizeText(body.ctaText, 40) : null,
      ctaLink: body.ctaLink ? sanitizeText(body.ctaLink, 200) : null,
      active: body.active !== false,
      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    },
  });
  return NextResponse.json({ banner });
}

export async function DELETE(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.banner.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
