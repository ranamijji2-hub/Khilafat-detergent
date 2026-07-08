import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { validateCheckoutPayload, sanitizeText } from '@/lib/validate';
import { sendOrderNotificationEmail, sendOrderConfirmationToCustomer } from '@/lib/mailer';

function generateOrderNumber() {
  const d = new Date();
  const datePart = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KD-${datePart}-${rand}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { valid, errors } = validateCheckoutPayload(body);
    if (!valid) return NextResponse.json({ errors }, { status: 400 });

    // Get Clerk user if logged in (optional)
    const { userId } = await auth();

    // Re-fetch authoritative product prices — never trust client prices
    const productIds = body.items.map((it) => Number(it.productId));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const itemsToCreate = [];
    for (const it of body.items) {
      const product = productMap.get(Number(it.productId));
      if (!product) {
        return NextResponse.json({ error: `Product ${it.productId} not found.` }, { status: 400 });
      }
      const qty = Math.max(1, Math.min(50, Number(it.qty)));
      subtotal += product.price * qty;
      itemsToCreate.push({
        productId: product.id,
        name: product.name,
        size: product.size,
        price: product.price,
        qty,
      });
    }

    let orderNumber = generateOrderNumber();
    while (await prisma.order.findUnique({ where: { orderNumber } })) {
      orderNumber = generateOrderNumber();
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: null,
        customerName: sanitizeText(body.customerName, 120),
        phone: sanitizeText(body.phone, 30),
        email: body.email ? sanitizeText(body.email, 120) : null,
        address: sanitizeText(body.address, 500),
        notes: body.notes ? sanitizeText(body.notes, 1000) : null,
        subtotal,
        total: subtotal,
        items: { create: itemsToCreate },
      },
      include: { items: true },
    });

    // Fire-and-forget emails — never block order success on email delivery
    Promise.allSettled([
  sendOrderNotificationEmail(order),
  sendOrderConfirmationToCustomer(order),
]).then((results) => {
  console.log("Email Results:", results);
});


    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('[orders] POST error:', err);
    return NextResponse.json({ error: 'Failed to place order.' }, { status: 500 });
  }
}

export async function GET(req) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();
  const status = searchParams.get('status');
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const pageSize = Math.min(100, Number(searchParams.get('pageSize') || 20));

  const where = {};
  if (status && status !== 'all') where.status = status;
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: 'insensitive' } },
      { customerName: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, pageSize });
}
