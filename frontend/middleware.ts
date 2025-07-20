// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/navigation';

export default createMiddleware({
  locales: locales,
  defaultLocale: 'vn',
});

export const config = {
  matcher: [
    '/',
    '/(vn|en)/:path*',
    '/((?!api|_next|_vercel|.*\\.|robots.txt).*)',
  ],
};
