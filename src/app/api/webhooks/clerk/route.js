import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[clerk-webhook] CLERK_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(webhookSecret);

  let event;
  try {
    event = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('[clerk-webhook] Verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const { type, data } = event;

  try {
    switch (type) {
      case 'user.created':
      case 'user.updated': {
        await prisma.user.upsert({
          where: { id: data.id },
          create: {
            id: data.id,
            email: data.email_addresses?.[0]?.email_address ?? null,
            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,
            imageUrl: data.image_url ?? null,
          },
          update: {
            email: data.email_addresses?.[0]?.email_address ?? null,
            firstName: data.first_name ?? null,
            lastName: data.last_name ?? null,
            imageUrl: data.image_url ?? null,
          },
        });
        break;
      }
      case 'user.deleted': {
        await prisma.user.deleteMany({ where: { id: data.id } });
        break;
      }
    }
  } catch (err) {
    console.error('[clerk-webhook] DB error:', err.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
