'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';
import { ShoppingCart, Menu, X, Phone, User } from 'lucide-react';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';

export default function Header({ settings }) {
  const { itemCount } = useCart();
  const { isSignedIn, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const logoUrl = settings?.logoUrl;
  const siteName = settings?.siteName || 'Khilafat Detergent';
  const phone = settings?.contact?.phone;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white'
      }`}
    >
      {/* Top bar */}
      {phone && (
        <div className="bg-primary py-1.5 text-center text-xs font-medium text-white/90">
          <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:text-white">
            <Phone size={12} /> {phone} — Free delivery across Pakistan on orders above Rs. 500
          </a>
        </div>
      )}

      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
        <Image
  src="/images/brand/logo.png"
  alt={siteName}
  width={400}
  height={90}
  priority
  className="h-12 w-auto"
 />
  
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ink/70 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Auth */}
          {isLoaded && (
            <div className="hidden sm:flex items-center">
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 text-sm font-semibold text-ink/70 hover:text-primary"
                  >
                    <User size={16} /> Account
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="flex items-center gap-1.5 rounded-full border border-primary/30 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/5">
                    <User size={15} /> Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-extrabold text-ink shadow">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/70 hover:bg-primary/5 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            {isLoaded && !isSignedIn && (
              <SignInButton mode="modal">
                <button className="mt-2 w-full rounded-lg border border-primary/30 py-2.5 text-sm font-semibold text-primary">
                  Sign In / Create Account
                </button>
              </SignInButton>
            )}
            {isLoaded && isSignedIn && (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/70 hover:bg-primary/5 hover:text-primary"
              >
                My Account & Orders
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
