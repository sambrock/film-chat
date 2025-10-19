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
  shellComponent: RootDocument,
});

function RootDocument(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className="text-foreground-0 bg-background-1 h-full w-full font-sans">
        <GlobalStoreProvider>
          <div className="relative flex h-full w-full flex-row">
            <div className="sticky top-0 left-0 z-20 h-screen w-[260px] shrink-0 py-2 pl-2">
              <Sidebar className="h-full w-full" />
            </div>
            <main className="bg-background-1 w-full">{props.children}</main>
          </div>
        </GlobalStoreProvider>
        <Scripts />
      </body>
    </html>
  );
}
