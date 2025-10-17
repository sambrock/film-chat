import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';

import { GlobalStoreProvider } from '~/stores/global-store-provider';
import { Sidebar } from '~/components/shared/sidebar';
import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'Film Chat - AI Movie Recommendations' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  errorComponent: (error) => <div className="p-4">An unexpected error occurred: {error.error.message}</div>,
  shellComponent: RootLayout,
});

function RootLayout({ children }: { children: React.ReactNode }) {
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

      <body className="text-foreground-0 bg-background-1 font-sans">
        <GlobalStoreProvider>
          <div className="relative flex h-full w-screen">
            <div className="h-screen p-2">
              <Sidebar />
            </div>
            <div className="bg-background-1 w-full">{children}</div>
          </div>
        </GlobalStoreProvider>

        {/* <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
            { name: 'React Query', render: <ReactQueryDevtoolsPanel /> },
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  );
}
