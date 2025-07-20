// app/(routes)/page.tsx
// 'use client';
import React from 'react';
// import { useTranslations } from 'next-intl';
import HeroSection from './landing/sections/HeroSection';
import FeaturesSection from './landing/sections/FeaturesSection';
import StackSection from './landing/sections/StackSection';
// import { getIntl } from '@/i18n/request';

export default async function HomePage() {
  // const t = useTranslations('HomePage');
  // const intl = await getIntl(locale);

  return (
    <>
      <main>
        <HeroSection id="hero" />
        <FeaturesSection id="features" />
        <StackSection id="stack" />
      </main>
    </>
  );
}
