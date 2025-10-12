import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient, trpc } from '@/lib/trpc/ssr';

// ssr not supported yet: https://github.com/TanStack/db/issues/545
// TODO: fix this when ssr story is figured out

export default async function Layout(props: React.PropsWithChildren) {
  const WithSync = async () => {
    const queryClient = getQueryClient();
    await Promise.all([
      queryClient.prefetchQuery(trpc.syncMessages.queryOptions()),
      queryClient.prefetchQuery(trpc.syncRecommendations.queryOptions()),
      queryClient.prefetchQuery(trpc.syncMovies.queryOptions()),
      queryClient.prefetchQuery(trpc.syncLibrary.queryOptions()),
    ]);

    return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
  };

  return (
    <Suspense>
      <WithSync />
    </Suspense>
  );
}
