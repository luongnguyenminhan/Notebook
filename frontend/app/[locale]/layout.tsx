import React from 'react';
import { Metadata } from 'next';
import RootLayoutServer from '../RootLayoutServer';
import FirstUserGate from '@/components/FirstUserGate';

export const metadata: Metadata = {
  icons: {
    icon: [
      { rel: 'icon', url: '/favicon.ico' },
      { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    ],
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
