import { createNavigation } from 'next-intl/navigation';
export const locales = ['en', 'vn'];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation();
