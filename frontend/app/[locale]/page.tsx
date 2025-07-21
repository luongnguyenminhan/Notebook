// app/(routes)/page.tsx
// 'use client';
import React from 'react';
// import { useTranslations } from 'next-intl';
import HeroSection from './landing/sections/HeroSection';
import FeaturesSection from './landing/sections/FeaturesSection';
import StackSection from './landing/sections/StackSection';
import ComponentsSection from './landing/sections/ComponentsSection';
import FooterSection from './landing/sections/FooterSection';
import InstallationSection from './landing/sections/InstallationSection';
import DocsSection from './landing/sections/DocsSection';
// import { getIntl } from '@/i18n/request';

export default async function HomePage() {
  // const t = useTranslations('HomePage');
  // const intl = await getIntl(locale);

  return (
    <>
      <main>
        <HeroSection id="hero" />
        <InstallationSection id="install" />
        <DocsSection id="docs" />
        <FeaturesSection id="features" />
        <StackSection id="stack" />
        <ComponentsSection id="component" />
        <FeaturesSection id="feature" />
        <FooterSection id="footer" />
      </main>
    </>
  );
}
