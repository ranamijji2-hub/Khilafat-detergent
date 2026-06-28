import { Resend } from 'resend';

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.RESEND_FROM_EMAIL || 'Khilafat Detergent <onboarding@resend.dev>';
const NOTIFY_TO = process.env.ORDER_NOTIFICATION_EMAIL || '';

// ─── Contact Inquiry ─────────────────────────────────────────────────────────
export async function sendContactInquiryEmail({ name, email, phone, message }) {
  const resend = getResend();
  if (!resend || !NOTIFY_TO) {
    console.log('[mailer] Resend not configured — skipping contact email');
    return { sent: false, reason: 'resend-not-configured' };
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `New Contact Inquiry from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:8px;">
          <div style="background:#0b3a8a;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:20px;">New Website Inquiry</h1>
          </div>
          <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email || '—'}</p>
            <p><strong>Phone:</strong> ${phone || '—'}</p>
            <p><strong>Message:</strong></p>
            <div style="background:#f8fafc;padding:12px;border-radius:6px;white-space:pre-wrap;">${message}</div>
          </div>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] Contact email failed:', err.message);
    return { sent: false, reason: err.message };
  }
}

// ─── Order Notification ───────────────────────────────────────────────────────
export async function sendOrderNotificationEmail(order) {
  const resend = getResend();
  if (!resend || !NOTIFY_TO) {
    console.log('[mailer] Resend not configured — skipping order email', order.orderNumber);
    return { sent: false, reason: 'resend-not-configured' };
  }

  const itemsHtml = order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;">${it.name} (${it.size})</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;">${it.qty}</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Rs. ${it.price}</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Rs. ${(it.price * it.qty).toFixed(0)}</td>
      </tr>`
    )
    .join('');

  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `🛒 New Order ${order.orderNumber} — Khilafat Detergent`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:8px;">
          <div style="background:#0b3a8a;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:20px;">New Order Received</h1>
            <p style="color:#93c5fd;margin:4px 0 0;">${order.orderNumber}</p>
          </div>
          <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
            <h3 style="color:#0b3a8a;margin:0 0 12px;">Customer Details</h3>
            <p style="margin:4px 0;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin:4px 0;"><strong>Phone:</strong> ${order.phone}</p>
            <p style="margin:4px 0;"><strong>Email:</strong> ${order.email || '—'}</p>
            <p style="margin:4px 0;"><strong>Address:</strong> ${order.address}</p>
            ${order.notes ? `<p style="margin:4px 0;"><strong>Notes:</strong> ${order.notes}</p>` : ''}

            <h3 style="color:#0b3a8a;margin:20px 0 12px;">Order Items</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#0b3a8a;color:#fff;">
                  <th style="padding:8px 12px;text-align:left;">Item</th>
                  <th style="padding:8px 12px;">Qty</th>
                  <th style="padding:8px 12px;text-align:right;">Price</th>
                  <th style="padding:8px 12px;text-align:right;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div style="text-align:right;margin-top:16px;font-size:18px;font-weight:bold;color:#0b3a8a;">
              Grand Total: Rs. ${order.total.toFixed(0)}
            </div>
            <p style="color:#64748b;font-size:13px;margin-top:8px;">Payment: Cash on Delivery</p>
          </div>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] Order email failed:', err.message);
    return { sent: false, reason: err.message };
  }
}

// ─── Order Confirmation to Customer ──────────────────────────────────────────
export async function sendOrderConfirmationToCustomer(order) {
  const resend = getResend();
  if (!resend || !order.email) return { sent: false, reason: 'no-email' };

  const itemsHtml = order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;">${it.name} (${it.size})</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;">${it.qty}</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right;">Rs. ${(it.price * it.qty).toFixed(0)}</td>
      </tr>`
    )
    .join('');

  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Order Confirmed — ${order.orderNumber} | Khilafat Detergent`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:8px;">
          <div style="background:#0b3a8a;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;">Thank You, ${order.customerName}!</h1>
            <p style="color:#93c5fd;margin:8px 0 0;">Your order has been received.</p>
          </div>
          <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
            <p style="color:#64748b;">Order Number: <strong style="color:#0b3a8a;">${order.orderNumber}</strong></p>

            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
              <thead>
                <tr style="background:#f1f5f9;">
                  <th style="padding:8px 12px;text-align:left;color:#0b3a8a;">Item</th>
                  <th style="padding:8px 12px;color:#0b3a8a;">Qty</th>
                  <th style="padding:8px 12px;text-align:right;color:#0b3a8a;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div style="text-align:right;margin-top:16px;font-size:18px;font-weight:bold;color:#0b3a8a;">
              Total: Rs. ${order.total.toFixed(0)}
            </div>

            <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin-top:20px;">
              <p style="color:#15803d;margin:0;font-weight:bold;">💳 Cash on Delivery</p>
              <p style="color:#166534;margin:4px 0 0;font-size:14px;">Pay when your order arrives. We'll contact you to confirm delivery.</p>
            </div>

            <p style="color:#64748b;font-size:13px;margin-top:20px;text-align:center;">
              Questions? WhatsApp us at <strong>+92 300 5344747</strong>
            </p>
          </div>
        </div>
      `,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] Customer confirmation email failed:', err.message);
    return { sent: false, reason: err.message };
  }
}
