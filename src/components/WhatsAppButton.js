'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ whatsapp, message = "Hi! I'd like to order Khilafat Detergent." }) {
  if (!whatsapp) return null;
  const cleaned = whatsapp.replace(/[^\d+]/g, '').replace(/^\+/, '');
  const href = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:scale-105 animate-float-slow"
    >
      <MessageCircle size={28} color="#ffffff" />
    </a>
  );
}
