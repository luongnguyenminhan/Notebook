import React from 'react';
import { Metadata } from 'next';
import RootLayoutServer from '../RootLayoutServer';
import FirstUserGate from '@/components/FirstUserGate';

export const metadata: Metadata = {
  icons: {
    icon: [
      { rel: 'icon', url: '/images/logos/secure_scribe_logo.jpg' },
      {
        rel: 'icon',
        url: '/images/logos/secure_scribe_logo.jpg',
        type: 'image/svg+xml',
      },
    ],
  },
  // Meta nhận diện thương hiệu
  title: 'SecureScribe - Ghi chú thông minh',
  description:
    'SecureScribe - Nền tảng ghi chú, lưu trữ và quản lý thông tin cá nhân hiện đại.',
  openGraph: {
    title: 'SecureScribe - Ghi chú thông minh',
    description:
      'SecureScribe - Nền tảng ghi chú, lưu trữ và quản lý thông tin cá nhân hiện đại.',
    images: [
      {
        url: '/images/background-features.jpg',
        width: 1200,
        height: 630,
        alt: 'SecureScribe - Ghi chú thông minh',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecureScribe - Ghi chú thông minh',
    description:
      'SecureScribe - Nền tảng ghi chú, lưu trữ và quản lý thông tin cá nhân hiện đại.',
    images: ['/images/background-features.jpg'],
  },
};
export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <RootLayoutServer params={params}>
      <FirstUserGate params={params}>{children}</FirstUserGate>
    </RootLayoutServer>
  );
}
