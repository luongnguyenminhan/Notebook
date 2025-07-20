// app/about/layout.tsx
import React from 'react';

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>About Section</h1>
      {children}
    </div>
  );
}
