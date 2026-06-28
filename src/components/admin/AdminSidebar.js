'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  ShoppingBag,
  Settings,
  Images,
  LogOut,
  ExternalLink,
} from 'lucide-react';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/media', label: 'Media Library', icon: Images },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
        <img src="/images/brand/logo.png" alt="Khilafat Detergent" className="h-9 w-9 rounded-lg" />
        <div>
          <div className="font-heading text-sm font-extrabold text-primary">Khilafat Admin</div>
          <div className="text-[11px] text-ink/45">RH &amp; Sons</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {LINKS.map((link) => {
          const active = isActive(link);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                active ? 'bg-primary text-white' : 'text-ink/65 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-gray-100 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/65 hover:bg-primary/5 hover:text-primary"
        >
          <ExternalLink size={18} /> View Website
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
