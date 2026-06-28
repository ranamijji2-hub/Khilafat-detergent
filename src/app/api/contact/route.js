import { NextResponse } from 'next/server';
import { sendContactInquiryEmail } from '@/lib/mailer';
import { sanitizeText } from '@/lib/validate';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 });
    }

    const result = await sendContactInquiryEmail({
      name: sanitizeText(name, 120),
      email: email ? sanitizeText(email, 120) : null,
      phone: phone ? sanitizeText(phone, 30) : null,
      message: sanitizeText(message, 2000),
    });

    return NextResponse.json({ success: true, emailSent: result.sent });
  } catch (err) {
    console.error('[contact] Error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
