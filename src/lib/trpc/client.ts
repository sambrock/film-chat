import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext, createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import superjson from 'superjson';

import { makeQueryClient } from './query-client';
import type { AppRouter } from './router';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: `https://${process.env.VERCEL_URL}/api/trpc`, transformer: superjson })],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: makeQueryClient(),
});
