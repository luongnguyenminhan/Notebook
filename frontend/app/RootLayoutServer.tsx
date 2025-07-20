// app/RootLayoutServer.tsx
import React from 'react';
import { getMessages } from 'next-intl/server';
import RootLayoutClient from './RootLayoutClient';
import { seoConfig } from 'config/seo';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: seoConfig.title,
    description: seoConfig.description,
    openGraph: {
      title: seoConfig.openGraph.title,
      description: seoConfig.openGraph.description,
      url: seoConfig.openGraph.url,
      type: seoConfig.openGraph.type as 'website',
    },
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    alternates: {
      canonical: seoConfig.url,
    },
    authors: [{ name: 'aelabid' }],
    keywords: [
      'next.js',
      'react',
      'typescript',
      'starter',
      'boilerplate',
      'nextjs starter',
    ],
  };
}

export default async function RootLayoutServer(props: Props) {
  const { params } = props;
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const messages = await getMessages({ locale });

  return (
    <RootLayoutClient locale={locale} messages={messages}>
      {props.children}
    </RootLayoutClient>
  );
}
