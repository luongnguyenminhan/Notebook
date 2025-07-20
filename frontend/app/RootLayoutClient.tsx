// app/RootLayoutClient.tsx
'use client';
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { ReactQueryProvider } from '@/context/ReactQueryProvider';
import { Provider } from 'react-redux';
import store from '@/store/index';
import Header from '@/components/layout/Header';
import { ChakraProvider } from '@chakra-ui/react';
import '@/styles/globals.css';
import Fonts from '@/styles/Fonts';
import Footer from '@/components/layout/Footer';

export default function RootLayoutClient({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: any;
}) {
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body>
        <Provider store={store}>
          <ReactQueryProvider>
            <NextIntlClientProvider
              locale={locale}
              messages={messages}
              timeZone="Europe/Paris"
            >
              <ChakraProvider>
                <Fonts />
                <Header />
                <main>{children}</main>
                <Footer />
              </ChakraProvider>
            </NextIntlClientProvider>
          </ReactQueryProvider>
        </Provider>
      </body>
    </html>
  );
}
