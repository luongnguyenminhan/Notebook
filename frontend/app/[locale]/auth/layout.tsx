import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'var(--input-bg-light)',
        color: 'var(--text-color-light)',
      }}
    >
      <div
        className="w-full max-w-md p-8 rounded"
        style={{
          background: 'var(--input-bg-light)',
          color: 'var(--text-color-light)',
        }}
      >
        {children}
      </div>
      <style>{`
        @media (prefers-color-scheme: dark) {
          div[min-h-screen] {
            background: var(--input-bg-dark) !important;
            color: var(--text-color-dark) !important;
          }
          div[max-w-md] {
            background: var(--input-bg-dark) !important;
            color: var(--text-color-dark) !important;
          }
        }
      `}</style>
    </div>
  );
}
