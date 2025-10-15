import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';

import { cn } from '~/lib/utils';
import { GlobalStoreProvider } from '~/providers/global-store-provider';
import { queryGetChatsOptions } from '~/hooks/use-query-get-chats';
import { Sidebar } from '~/components/layout/sidebar';

import '../styles/globals.css';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context }) => context.queryClient.ensureQueryData(queryGetChatsOptions()),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'Film Chat - AI Movie Recommendations' },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Film Chat" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>

      <body className={cn('text-foreground-0 bg-background-1 font-sans')}>
        <GlobalStoreProvider>
          <div className="relative flex h-full w-screen">
            <div className="h-screen p-2">
              <Sidebar />
            </div>
            <div className="bg-background-1 w-full">
              <Outlet />
            </div>
          </div>
          <Scripts />
        </GlobalStoreProvider>
        {/* <ReactQueryDevtools />
        <TanStackRouterDevtools position="bottom-right" /> */}
      </body>
    </html>
  );
}
