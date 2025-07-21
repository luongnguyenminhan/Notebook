// app/(routes)/page.tsx
'use client';
import React from 'react';
import InitSuperUserForm from '@/components/auth/InitSuperUserForm';
import { useFirstUserCheck } from '@/hooks/useFirstUserCheck';
// import { useTranslations } from 'next-intl';
import HeroSection from './landing/sections/HeroSection';
import FeaturesSection from './landing/sections/FeaturesSection';
import StackSection from './landing/sections/StackSection';
import ComponentsSection from './landing/sections/ComponentsSection';
import FooterSection from './landing/sections/FooterSection';
import InstallationSection from './landing/sections/InstallationSection';
import DocsSection from './landing/sections/DocsSection';
import Header from '@/components/layout/Header';
// import { getIntl } from '@/i18n/request';

export default function HomePage() {
  const { isFirstUser, loading, error } = useFirstUserCheck();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-error flex justify-center items-center h-screen">
        {error}
      </div>
    );
  }
  if (isFirstUser) {
    return <InitSuperUserForm />;
  }
  return (
    <>
      <main>
        <Header />
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
