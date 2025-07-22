// app/dashboard/layout.tsx
'use client';
import Header from '@/components/layout/Header';
import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {/* <aside>Dashboard Sidebar</aside> */}
      <main>{children}</main>
    </div>
  );
}
