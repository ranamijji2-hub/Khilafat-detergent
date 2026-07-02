import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'khilafat_admin_session';

function getSecretKey() {
  const secret = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
  return new TextEncoder().encode(secret);
}

const isAdminRoute = createRouteMatcher(['/admin/:path*']);
const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/about',
  '/contact',
  '/cart',
  '/checkout',
  '/order-confirmation(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/products(.*)',
  '/api/banners(.*)',
  '/api/orders',
  '/api/contact',
  '/api/settings',
  '/api/auth(.*)',
  '/api/webhooks(.*)',
  '/api/uploadthing(.*)',
  '/robots.txt',
'/sitemap.xml',
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Admin routes protected by custom JWT (not Clerk)
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    try {
      await jwtVerify(token, getSecretKey());
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Protect non-public routes with Clerk
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
