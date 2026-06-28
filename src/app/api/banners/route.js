import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText } from '@/lib/validate';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === 'true';

  let where = {};
  if (!all) {
    where = { active: true };
  } else {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const banners = await prisma.banner.findMany({ where, orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ banners });
}

export async function POST(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.image) {
    return NextResponse.json({ error: 'Title and image are required.' }, { status: 400 });
  }

  const banner = await prisma.banner.create({
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
  return NextResponse.json({ banner }, { status: 201 });
}
