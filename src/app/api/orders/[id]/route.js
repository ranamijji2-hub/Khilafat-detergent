import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

const VALID_STATUSES = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

export async function GET(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { id: Number(params.id) },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(req, { params }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data: { status: body.status },
  });
  return NextResponse.json({ order });
}
