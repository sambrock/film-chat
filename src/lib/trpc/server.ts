import 'server-only';

import { cache } from 'react';
import { createHydrationHelpers } from '@trpc/react-query/rsc';

import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';

export const getQueryClient = cache(makeQueryClient);

const caller = createCallerFactory(appRouter)(createTRPCContext);

const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(caller, getQueryClient);

export { trpc, HydrateClient };
