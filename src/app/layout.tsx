import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import { headers } from 'next/headers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { auth } from '@/lib/auth/server';
import { cn } from '@/lib/utils';
import { GlobalStoreProvider } from '@/providers/global-store-provider';
import { QueryClientTRPCProvider } from '@/providers/query-client-trpc-provider';
import { SessionInit } from './session-init';

import './globals.css';

import { Sidebar } from '@/components/layout/sidebar';

const fontSans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Film Chat - AI Movie Recommendations',
  description:
    'Get personalized movie recommendations powered by AI. Chat and discover your next favorite film!',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Film Chat" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>

      <body className={cn('text-foreground-0 bg-background-1', fontSans.className)}>
        <QueryClientTRPCProvider>
          <GlobalStoreProvider>
            <div className="relative flex h-full w-screen">
              <div className="h-screen p-2">
                <Sidebar />
              </div>
              <div className="bg-background-1 w-full">{props.children}</div>
            </div>
          </GlobalStoreProvider>
          <ReactQueryDevtools />
        </QueryClientTRPCProvider>
        <Suspense>
          <SessionInit
            shouldSignInAnonymously={(await auth.api.getSession({ headers: await headers() })) === null}
          />
        </Suspense>
      </body>
    </html>
  );
}
