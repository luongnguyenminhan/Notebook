// context/ReactQueryProvider.tsx
'use client';

import queryClient from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} />{' '} */}
      {/* Devtools for debugging */}
    </QueryClientProvider>
  );
}
