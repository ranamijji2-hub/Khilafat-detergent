import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Truck, ShieldCheck, Clock3, BadgeCheck } from 'lucide-react';

export default function Footer({ settings }) {
  const year = new Date().getFullYear();

  const trustBadges = [
    { icon: ShieldCheck, title: 'Cash on Delivery', text: 'Easy & safe payment' },
    { icon: Truck, title: 'Fast Delivery', text: 'Across Pakistan' },
    { icon: BadgeCheck, title: 'Premium Quality', text: 'Trusted formula' },
    { icon: Clock3, title: '24/7 Support', text: 'We are here for you' },
  ];

  return (
    <footer className="bg-[var(--color-primary-dark)] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 border-b border-white/10">
        {trustBadges.map((b) => (
          <div key={b.title} className="flex items-start gap-3">
            <b.icon size={28} className="text-accent shrink-0" />
            <div>
              <div className="text-sm font-bold">{b.title}</div>
              <div className="text-xs text-white/70">{b.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <img src="/images/brand/logo.png" alt={`${settings.siteName} logo`} className="h-10 w-10 rounded-lg" />
            <span className="font-heading text-lg font-extrabold">{settings.siteName}</span>
          </div>
          <p className="text-sm leading-relaxed text-white/70">{settings.tagline}</p>
        </div>

        <div>
          <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-accent">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/products" className="hover:text-white">Products</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-accent">Contact Us</h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {settings.contact.address}</li>
            <li className="flex items-center gap-2"><Phone size={16} /> <a href={`tel:${settings.contact.phone.replace(/\s/g, '')}`} className="hover:text-white">{settings.contact.phone}</a></li>
            <li className="flex items-center gap-2"><Mail size={16} /> <a href={`mailto:${settings.contact.email}`} className="hover:text-white">{settings.contact.email}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-accent">Follow Us</h4>
          <div className="flex gap-3">
            {settings.social.facebook && (
              <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-full bg-white/10 p-2.5 hover:bg-accent hover:text-ink transition">
                <Facebook size={18} />
              </a>
            )}
            {settings.social.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2.5 hover:bg-accent hover:text-ink transition">
                <Instagram size={18} />
              </a>
            )}
            {settings.social.youtube && (
              <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-full bg-white/10 p-2.5 hover:bg-accent hover:text-ink transition">
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/60">
        © {year} {settings.companyName}. All Rights Reserved. — {settings.siteName}
      </div>
    </footer>
  );
}
