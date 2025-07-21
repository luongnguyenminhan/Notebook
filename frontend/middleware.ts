// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/navigation';

import { NextRequest, NextResponse } from 'next/server';

const baseMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: 'vn',
});

export default function middleware(req: NextRequest) {
  // Check for token in cookie and block /auth or /[locale]/auth route
  const token = req.cookies.get('token');
  const pathname = req.nextUrl.pathname;
  // Match /auth or /[locale]/auth
  const authRegex = /^\/(?:[a-z]{2}\/)?auth(\/|$)/;
  if (token && authRegex.test(pathname)) {
    // Redirect to home page if token exists
    return NextResponse.redirect(new URL('/', req.url));
  }
  return baseMiddleware(req);
}

export const config = {
  matcher: [
    '/',
    '/(vn|en)/:path*',
    '/((?!api|_next|_vercel|.*\\.|robots.txt).*)',
  ],
};
